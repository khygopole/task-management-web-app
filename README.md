# TASK MANAGEMENT SYSTEM WEB APPLICATION - by Khyle Matthew Gopole

- [TASK MANAGEMENT SYSTEM WEB APPLICATION - by Khyle Matthew Gopole](#task-management-system-web-application---by-khyle-matthew-gopole)
  - [Introduction](#introduction)
    - [Description](#description)
    - [Tools and Technologies](#tools-and-technologies)
      - [UI/UX Design Tool](#uiux-design-tool)
      - [Frontend Technologies](#frontend-technologies)
        - [Frontend Tools or Libraries](#frontend-tools-or-libraries)
      - [Backend Technologies](#backend-technologies)
        - [Backend Tools or Libraries](#backend-tools-or-libraries)
      - [Database](#database)
      - [Deployment \& Hosting](#deployment--hosting)
- [Project Deployment](#project-deployment)
  - [Setup Instruction](#setup-instruction)
  - [API Documentation](#api-documentation)
    - [API for User](#api-for-user)
    - [API for Task](#api-for-task)
  - [Assumptions and Decisions Made](#assumptions-and-decisions-made)
    - [Project Structure](#project-structure)
    - [Technology Stack](#technology-stack)
    - [Authentication](#authentication)
    - [Validation](#validation)
    - [Deployment](#deployment)
    - [Limitations in Features](#limitations-in-features)

## Introduction

### Description

Task Management System Web Application is a fullstack web application that allows users to create their account, and create personal tasks with names, description, and deadline that they can personally configure. It also allows users to mark their tasks "In Progress" or "Finished", aiding users to manage their tasks and monitor their status.

### Tools and Technologies

#### UI/UX Design Tool

- Figma

#### Frontend Technologies

- React.js
- HTML
- CSS
- Tailwind CSS
- JavaScript
- TypeScript

##### Frontend Tools or Libraries

- React Hook Form
- React Router
- Fetch API
- Axios

#### Backend Technologies

- Node.js
- Express.js

##### Backend Tools or Libraries

- Zod
- MongoDB
- Bcrypt.js
- JsonWebToken (JWT)
- dotenv
- Nodemon

#### Database

- MongoDB
- MongoDB Atlas

#### Deployment & Hosting

- Render (Free Tier)

# Project Deployment

- The project was deployed using the free-tier mode of Render and can be accessed here: [Task Management System Web App-khygopole](https://task-management-system-web-app-ktf9.onrender.com)
- As this is a free-tier, it has limitations
- Nevertheless, the project can also be tested in development mode using the setup instruction below

## Setup Instruction

```
PREREQUISITES
- Node.js (LTS version)
- npm
```

1. Clone the Repository using the command below:

```bash
git clone https://github.com/khygopole/task-management-web-app.git
```

2. Ensure that you use the main branch. Once successfully cloned, navigate into the project directory by UI or by CLI using the command below:

```bash
cd task-management-web-app
```

3. Navigate to the backend folder:

```bash
cd backend
```

4. Create the `.env` file for the environment variables based on the `.env.example` provided:

```bash
cp .env.example .env
```

5. Input the `.env` file created with these values:

- `DATABASE_URI` = `mongodb+srv://user1234:VB1LI2xMweGrJowt@taskmanagementsys.tnm4wyl.mongodb.net/?retryWrites=true&w=majority&appName=TaskManagementSys`
- `JWT_SECRET_KEY` = `da00ff2b54e8a812c0aaa0dfb31b07d0786584a9323210088553bb30c4b0114e`

6. After setting up the `.env` file, install the packages essential for the backend:

```bash
npm install
```

7. Run the backend server in development mode:

```bash
npm run dev
```

8. Open a new terminal window and navigate to the frontend folder. Assuming that the new terminal window is still in the `/backend` path:

```bash
cd ../frontend
```

9. Install the packages essential for the frontend:

```bash
npm install
```

10. Run the frontend in development mode:

```bash
npm run dev
```

11. The application should already be running and is accessible at `http://localhost:5173`

## API Documentation

The following lists the endpoints for the backend interaction. The server's base URL is `http://localhost:3000`

### API for User

`POST /users/login`

- Description: Authenticates the user by verifying account email and password
- Request Body:

```json
{
  "email": "khyle@gmail.com",
  "password": "Khyle123"
}
```

- Success Response:

```json
// HTTP 200
{
  "Status": "Success",
  "message": "Account successfully logged in"
}
```

<br/>

`POST /users/signup`

- Description: Creates an account for the user
- Request Body:

```json
{
  "username": "Admin",
  "email": "admin@gmail.com",
  "password": "Admin12345"
}
```

- Success Response:

```json
// HTTP 201
{
  "Status": "Success",
  "message": "Account successfully created"
}
```

<br/>

`GET /users/navigationName`

- Description: Retrieves the username of the logged in user for the display name in the navigation bar
- Success Response:

```json
{ "username": "John" }
```

<br/>

`POST /users/logout`

- Description: Logouts the user from the website by clearing the user's token in the cookie
- Success Response:

```json
{
  "message": "Successfully logged out"
}
```

### API for Task

`POST /tasks/newTask`

- Description: Creates a task using the entered properties by the user (TaskName, TaskDeadline, and TaskDescription)
- Request Body:

```json
{
  "TaskName": "Programming Exercise",
  "TaskDeadline": "2025-08-28T15:00",
  "TaskDescription": "Create a C++ program with OOP",
  "isFinished": "false",
  "_id": "677788addad88319382392378"
}
```

- Success Response:

```json
// HTTP 201
{
  "message": "A New Task has been successfully created"
}
```

<br/>

`GET /tasks/inprogress`

- Description: Retrieves the user's tasks that are in progress status
- Success Response:

```json
// HTTP 200
{
   "data": [
        {
            "_id": "008763478234asdasdq23412349347",
    "TaskName": "Exercise Warmup",
    "TaskDeadline": "2025-08-28T15:00",
    "TaskDescription": "Do pushups and situps",
    "isFinished": false;
        },
        {
            "_id": "55578asdasd3wqas0992340000awd0",
    "TaskName": "Math Assignment",
    "TaskDeadline": "2025-09-28T15:00",
    "TaskDescription": "Find the limits under the curve",
    "isFinished": false;
        },
    ],
    "username": "Ann",
    "message": "Successfully retrieved in progress tasks",
}
```

<br/>

`GET /tasks/finished`

- Description: Retrieves the user's tasks that are with finished status
- Success Response:

```json
// HTTP 200
{
    "data":[
        {
            "_id": "008763478234asdasdq23412349347",
            "TaskName": "Exercise Warmup",
            "TaskDeadline": "2025-08-28T15:00",
            "TaskDescription": "Do pushups and situps",
            "isFinished": true;
        },
        {
            "_id": "55578asdasd3wqas0992340000awd0",
            "TaskName": "Math Assignment",
            "TaskDeadline": "2025-09-28T15:00",
            "TaskDescription": "Find the limits under the curve",
            "isFinished": true;
        },
    ],
    "username": "Ann",
    "message": "Successfully retrieved in progress tasks",
}
```

<br/>

`GET /tasks/:id`

- Description: Retrieves a specific task of a user using the task's unique id from params
- Success Response:

```json
// HTTP 200
{
    "data": [
        {
            "_id": "55578asdasd3wqas0992340000awd0",
            "TaskName": "Math Assignment",
            "TaskDeadline": "2025-09-28T15:00",
            "TaskDescription": "Find the limits under the curve",
            "isFinished": true;
        },
    ],
    "username": "Ann",
    "message": "Successfully retrieved the task",
}
```

<br/>

`PUT /tasks/:id`

- Description: Updates a task selected by the user
- Request Body:

```json
{
  "TaskName": "Party",
  "TaskDeadline": "2025-09-28T15:00",
  "TaskDescription": "Buy a birthday gift in Corner Store then gift wrap it at sidewalk."
}
```

- Success Response:

```json
// HTTP 200
{
  "message": "Task updated successfully"
}
```

<br/>

`DELETE /tasks/:id`

- Description: Deletes a task selected by the user
- Success Response:

```json
// HTTP 200
{
  "message": "Task deleted successfully"
}
```

<br/>

`PUT /tasks/:id/changeStatus`

- Description: Updates the status of the task IP (In Progress) or Done (Finished)
- Request Body:

```json
{
  "isFinished": false
}
```

- Success Response:

```json
// HTTP 200
{
  "message": "Task updated successfully"
}
```

## Assumptions and Decisions Made

### Project Structure

I've decided to create a separate folder for the frontend and the backend so that it will look more organized. For the frontend, I created a component folder for the frontend components, a utils folder for the utilities, types, and schemas, and a pages folder for the web pages. Similarly, I created routes folder for the API routes of user and task, utils for utilities and types/schema, and database for the database script. In summary, having a folder structure like this would look cleaner and easy to maintain during troubleshooting and debugging.

### Technology Stack

- As required, I utilized MERN stack (MongoDB, Express, React, and Node) to develop the project. Other technologies would still be able to work but in terms of experience and background, I chose to use MERN for convenience and time restrictions.
- Unfortunately, I was not able to use ORM since I used raw MongoDB commands as I utilized MongoDB Atlas for easiness.

### Authentication

- As required, I implemented authentication in the project using JWT. With JWT, I was able to perform secure authentication in integration with Cookies so that whenever a user logs in, a token would be generated for their session.
- With the use of the token in the cookies, I was able to implement PrivateRoutes so that only sessions with token can access the privated pages.

### Validation

I utilized Zod library for schema-based data validation. Other validation method can also be used but for convenience, I chose to use this approach.

### Deployment

I was able to try to deploy this project using the free-tier mode of Render to demonstrate how full deployment could be done which will be a learning experience for me.

### Limitations in Features

- `Login/SignUp`: I created the authentication without verifying the legitimacy of email as that would require me to use external API. Hence, users can create an account without using legit gmail, yahoo, etc. accounts as long as its formatted as email
- `Overdue Task`: I created the task management feature with overdue feature. Hence, the system would be able to tell if a task is past its due date. An overdue task can be edited as long as the user would also update its deadline
- `Account Creation`: As this is a simple fullstack project developed in a short timeframe, other features like "Forgot password", "Email Verification", "Account Deactivation" are not included
- `Not Implemented`: As required, the project must be dockerize and apply state management like Redux. I was not able to implement these due to the timeframe and lack of familiarity with these technologies. Also, I tried exploring in deployment which I have attempted in Render without needing the use of Docker.
