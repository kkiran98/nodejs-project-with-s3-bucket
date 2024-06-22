# Node.js Project Setup

This project is a Node.js application that uses MongoDB for the database and AWS S3 for image storage. The application includes user registration, login, and additional address management with image uploads.

## Prerequisites

Ensure you have the following installed on your machine:

- Node.js (v20 or higher)
- Docker (for MongoDB)
- AWS account with S3 bucket configured
- MongoDB Atlas account (if not using Docker)

## Installation and Setup

### Clone the repository:

```sh
 git clone <repository-url>
 cd <repocitory-url>
```
Create .env file:

Create a .env file in the root directory and add your configurations:
```sh
PORT=3000
MONGO_URL=mongodb://mongodb:27017/signupDB
AWS_REGION=<your-aws-region>
AWS_ACCESS_KEY_ID=<your-aws-access-key-id>
AWS_SECRET_ACCESS_KEY=<your-aws-secret-access-key>
AWS_BUCKET_NAME=<your-aws-s3-bucket-name>
```

Set up Docker and Docker Compose:

Ensure you have Docker installed, then run:
```sh
sudo apt-get update
sudo apt install docker.io
sudo chown $USER /var/run/docker.sock
```
install docker-compose
```sh
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker-compose --version
```
Dockerfile

The Dockerfile sets up a Node.js environment to run the application.
docker-compose.yml

The docker-compose.yml file defines two services:

    app: The Node.js application
    mongodb: The MongoDB database

Run the following command to build and start the containers:

```sh
$ docker-compose build
```



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



   Jenkins setup
   for automation i am using Jenkins tool.

   
    ```sh 
    
    sudo apt update
    sudo apt upgrade -y
    
    ```
    
    installation of Jenkins tool on ubuntu.
    install java7 before installing Jenkins. 

    
    ```sh
    
    sudo apt install openjdk-11-jdk -y
    
    ```
    
    Add Jenkins Repository:

    
    ```sh
    
    sudo wget -O /usr/share/keyrings/jenkins-keyring.asc \
    https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key
    echo "deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc]" \
    https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
    /etc/apt/sources.list.d/jenkins.list > /dev/null
    sudo apt-get update
    sudo apt-get install jenkins -y
    
    ```
    
    Start Jenkins:

    
    ```sh
    
    sudo systemctl start jenkins
    sudo systemctl enable jenkins
    
    ```
    
    
    Access Jenkins:
    Open a web browser and go to http://your_server_ip_or_domain:8080. You'll need to unlock Jenkins by entering the initial admin password, which can be found using:
    
    ```sh
    
    sudo cat /var/lib/jenkins/secrets/initialAdminPassword
    
    ```
    
    go to manage jenkins add credentials with all required environment variables present in Jenkinsfile.
    

```sh    
DOCKER_HUB_CREDENTIALS = credentials('Dockerhub') 
        IMAGE_NAME = 'yourrepo/imagename'
        TIMAGE_NAME = 'yourdockerhubrepository'
        IMAGE_TAG = "v${BUILD_NUMBER}"
        KUBECONFIG = credentials('kubeconfig')
        AWS_ACCESS_KEY_ID = credentials('AWS_ACCESS_KEY_ID')
        AWS_SECRET_ACCESS_KEY = credentials('AWS_SECRET_ACCESS_KEY')
        AWS_REGION = credentials('AWS_REGION')
        AWS_BUCKET_NAME = credentials('AWS_BUCKET_NAME')
        MONGO_URL = credentials('MONGO_URL')
        MONGODB_URL = credentials('MONGODB_URL')
        MONGO_INITDB_ROOT_USERNAME = credentials('MONGO_INITDB_ROOT_USERNAME')
        MONGO_INITDB_ROOT_PASSWORD = credentials('MONGO_INITDB_ROOT_PASSWORD')
        MONGO_INITDB_DATABASE = credentials('MONGO_INITDB_DATABASE')
        NODE_ENV = 'production'
        PORT = 'portnumber:4000'
        NAMESPACE = 'your namespace in kubernetes'
        INPUT_FILE = 'deployment.yaml'
        OLD_REPO = 'dockerhub-repository:version'
        NEW_REPO = 'yourrepo/imagename'

``` 


Install kubectl in ubuntu

```sh
docker version
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl
chmod +x kubectl
mv ./kubectl /usr/local/bin/kubectl
kubectl version --client"
```


setup KIND(kubernetes in Docker) in ubuntu


```sh
curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.11.1/kind-linux-amd64
chmod +x ./kind
mv ./kind /usr/local/bin
which kind
kind version
```

it will take 20 minutes to setup

```sh
kubectl get all
kubectl get nodes
```


Explanation:

    Environment Variables: Defined in the environment block are credentials and configuration values needed throughout the pipeline.
    Stages:
        Clone GitHub repository: Checks out the project source code from GitHub.
        Prepare Environment: Creates a .env file with required environment variables for the Node.js application.
        Build Docker Image: Builds a Docker image using the Dockerfile present in the checked-out repository.
        Push Docker Image to Docker Hub: Tags and pushes the built Docker image to Docker Hub.
        Deployment: Prepares Kubernetes deployment by replacing image references in deployment.yaml.
        Replace ConfigMap Variables: Updates configmap.yaml with environment-specific values.
        Replace Secret Variables: Converts sensitive credentials to base64 and updates secrets.yaml.
        Deploy Application: Applies Kubernetes manifests (secrets.yaml, configmap.yaml, deployment.yaml) and verifies deployments.




















