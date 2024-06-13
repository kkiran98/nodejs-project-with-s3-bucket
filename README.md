Node.js Project Setup

This project is a Node.js application that uses MongoDB for the database and AWS S3 for image storage. The application includes user registration, login, and additional address management with image uploads. Below are the steps to set up and run the project.
Prerequisites

Ensure you have the following installed on your machine:

    Node.js (v20 or higher)
    Docker (for MongoDB)
    AWS account with S3 bucket configured
    MongoDB Atlas account (if not using Docker)

Installation and Setup

    Clone the repository:

    sh

git clone <repository-url>
cd <repository-directory>

Install dependencies:

sh

npm install

Create .env file:
Create a .env file in the root directory and add your configurations:

env

PORT=3000
MONGO_URL=mongodb://mongodb:27017/signupDB
AWS_REGION=<your-aws-region>
AWS_ACCESS_KEY_ID=<your-aws-access-key-id>
AWS_SECRET_ACCESS_KEY=<your-aws-secret-access-key>
AWS_BUCKET_NAME=<your-aws-s3-bucket-name>

Set up Docker and Docker Compose:
Ensure you have Docker installed, then run:

sh

docker-compose up -d

Run the application:

sh

    npm start

The application should now be running on http://localhost:3000.
Docker Setup

This project includes a Dockerfile and docker-compose.yml file for containerization.
Dockerfile

The Dockerfile sets up a Node.js environment to run the application.
docker-compose.yml

The docker-compose.yml file defines two services:

    app: The Node.js application
    mongodb: The MongoDB database

Run the following command to build and start the containers:

sh

docker-compose up --build

Application Structure

    app.js: Main application file
    views/: Directory containing HTML files for signup, login, and adding more information
    public/: Static files served by the application
    .env: Configuration file for environment variables
    Dockerfile: Docker configuration for the Node.js application
    docker-compose.yml: Docker Compose configuration for the application and MongoDB

Routes

    GET /: Redirects to the login page
    GET /signup: Serves the signup page
    POST /signup: Handles user signup and image upload
    GET /login: Serves the login page
    POST /login: Handles user login
    GET /user-data: Fetches user data
    DELETE /delete-user/:email: Deletes a user's address, phone number, and image
    GET /add-more: Serves the page to add more information
    POST /add-more: Handles adding additional addresses and images for a user

Environment Variables

Ensure you have the following environment variables set in your .env file:

    PORT: Port number on which the application runs
    MONGO_URL: MongoDB connection string
    AWS_REGION: AWS region for S3
    AWS_ACCESS_KEY_ID: AWS access key ID
    AWS_SECRET_ACCESS_KEY: AWS secret access key
    AWS_BUCKET_NAME: AWS S3 bucket name

Frontend

The frontend includes basic HTML forms for user registration, login, and adding additional information. The styles are embedded in the HTML files.
Usage
Signup

    Visit http://localhost:3000/signup
    Fill out the form and upload an image
    Submit the form to create a new user

Login

    Visit http://localhost:3000/login
    Fill out the login form
    Submit the form to login

Add More Information

    Visit http://localhost:3000/add-more
    Fill out the form to add more addresses and images
    Submit the form to update the user information

Fetch User Data

    Use the "Fetch User Data" button on the /add-more page to retrieve and display all users' information

License

This project is licensed under the MIT License.

