const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const sharp = require('sharp');
const { S3Client, DeleteObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
require('dotenv').config();

const app = express();

// AWS S3 configuration
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// Multer configuration for S3
const upload = multer({
    storage: multer.memoryStorage(),
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

// Define a schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    phno: String,
    password: String,
    address: String,
    imageUrl: String,
    smallImageUrl: String,
    additionalAddresses: [{
        address: String,
        phno: String,
        imageUrl: String,
        smallImageUrl: String,
    }]
});

// Define a model
const User = mongoose.model('User', userSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Debugging middleware to log incoming requests
app.use((req, res, next) => {
    console.log(`Incoming ${req.method} request to ${req.url}`);
    next();
});

// Serve static files
app.use(express.static('views'));

// Routes
app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});

app.post('/signup', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            throw new Error('File is not uploaded');
        }

        const smallImageBuffer = await sharp(req.file.buffer)
            .resize({ width: 50 })
            .toBuffer();

        const uploadOriginal = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: Date.now().toString() + '-' + req.file.originalname,
            Body: req.file.buffer,
            ACL: 'public-read'
        };

        const uploadSmall = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: Date.now().toString() + '-small-' + req.file.originalname,
            Body: smallImageBuffer,
            ACL: 'public-read'
        };

        const [dataOriginal, dataSmall] = await Promise.all([
            s3.send(new PutObjectCommand(uploadOriginal)),
            s3.send(new PutObjectCommand(uploadSmall))
        ]);

        const getUrl = (key) => `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            phno: req.body.phno,
            password: req.body.password,
            address: req.body.address,
            imageUrl: getUrl(uploadOriginal.Key),
            smallImageUrl: getUrl(uploadSmall.Key),
        });

        await newUser.save();
        res.redirect('/login');
    } catch (err) {
        res.status(500).send(`Error during signup: ${err.message}`);
    }
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email, password: req.body.password });
        if (user) {
            res.redirect('/add-more');
        } else {
            res.status(401).send('Invalid login credentials');
        }
    } catch (err) {
        res.status(500).send(`Error during login: ${err.message}`);
    }
});

app.get('/user-data', async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (err) {
        res.status(500).send(`Error fetching user data: ${err.message}`);
    }
});

app.get('/fetch-user-data', async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (err) {
        res.status(500).send(`Error fetching user data: ${err.message}`);
    }
});

app.delete('/delete-user/:email', async (req, res) => {
    try {
        const email = req.params.email;

        const user = await User.findOne({ email });

        if (user) {
            user.address = "";
            user.phno = "";

            if (user.imageUrl) {
                const mainImageKey = user.imageUrl.split('/').pop();
                await s3.send(new DeleteObjectCommand({
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: mainImageKey
                }));
                user.imageUrl = "";
            }

            await user.save();

            res.json({ success: true });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: `Error deleting user: ${err.message}` });
    }
});

app.get('/add-more', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'add-more.html'));
});

app.post('/add-more', upload.single('image'), async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            const smallImageBuffer = await sharp(req.file.buffer)
                .resize({ width: 50 })
                .toBuffer();

            const uploadOriginal = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: Date.now().toString() + '-' + req.file.originalname,
                Body: req.file.buffer,
                ACL: 'public-read'
            };

            const [dataOriginal] = await Promise.all([
                s3.send(new PutObjectCommand(uploadOriginal))
            ]);

            const getUrl = (key) => `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

            user.additionalAddresses.push({
                address: req.body.address,
                phno: req.body.phno,
                imageUrl: getUrl(uploadOriginal.Key)
            });

            await user.save();
            res.redirect('/add-more');
        } else {
            res.status(404).send('User not found');
        }
    } catch (err) {
        res.status(500).send(`Error during adding more info: ${err.message}`);
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

