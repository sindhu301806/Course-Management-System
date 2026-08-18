# Course Registration System

A full-stack web application for managing university courses, students, instructors, course registration, and academic information.

The system provides separate views and workflows for students and instructors, with a React.js frontend, Node.js/Express.js backend, and PostgreSQL database.

## Features

* Student login and authentication
* Student profile and academic information
* Browse all available courses
* Browse courses by department
* View detailed course information
* View course prerequisites
* View instructors teaching a course
* Browse instructor information
* View current and previous semester courses
* Register for courses
* Drop registered courses
* View currently running courses
* RESTful backend APIs
* PostgreSQL database integration

## Tech Stack

### Frontend

* React.js
* React Router
* JavaScript
* HTML/CSS

### Backend

* Node.js
* Express.js
* REST APIs
* PostgreSQL client (`pg`)
* CORS
* Body Parser

### Database

* PostgreSQL
* Relational database design

## Project Structure

```text
Course-Registration-System/
│
├── backend/
│   ├── config.js
│   ├── data.js
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
│
├── frontend/
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   ├── homepage.js
│   ├── login.js
│   ├── register.js
│   ├── CourseList.js
│   ├── courseinfo.js
│   ├── courseindept.js
│   ├── instructor.js
│   ├── instructorlist.js
│   ├── nav.js
│   ├── rcdl.js
│   └── ...
│
└── README.md
```

## Application Architecture

```text
┌──────────────────────┐
│      React.js        │
│      Frontend        │
└──────────┬───────────┘
           │
           │ REST API
           ▼
┌──────────────────────┐
│   Node.js + Express  │
│       Backend        │
└──────────┬───────────┘
           │
           │ SQL Queries
           ▼
┌──────────────────────┐
│     PostgreSQL       │
│       Database       │
└──────────────────────┘
```

The React frontend communicates with the Express backend through RESTful API endpoints. The backend handles database queries and returns the required information to the frontend.

## API Endpoints

### Authentication

```text
POST /login
```

Authenticates a user using their ID and password.

### Courses

```text
GET /courses
GET /courses/:courseId
GET /courses/:courseId/prereqs
GET /courses/:courseId/instructors
```

Used to retrieve course lists, course details, prerequisites, and instructors.

### Departments

```text
GET /departments
GET /alldepts
GET /coursesindept/:dname
GET /coursesindep/:dname
```

Used to retrieve departments and courses belonging to a department.

### Students

```text
POST /student
DELETE /student/drop/:studentId/:courseId
```

Used to retrieve student information and drop registered courses.

### Instructors

```text
GET /instructor
GET /instructor/:iid
```

Used to retrieve instructor lists and instructor-specific course information.

### Registration

```text
POST /register
GET /coursesrunning
GET /coursesrunning/:cs
```

Used for course registration and viewing currently running courses.

## Installation

### Prerequisites

Make sure the following are installed:

* Node.js
* npm
* PostgreSQL
* Git

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/course-registration-system.git
cd course-registration-system
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Configure PostgreSQL

Create a PostgreSQL database named:

```text
lab4
```

Update the database configuration in `backend/config.js` according to your local PostgreSQL setup.

Example:

```javascript
module.exports = {
    user: "postgres",
    host: "127.0.0.1",
    database: "lab4",
    password: "YOUR_PASSWORD",
    port: 5432
};
```

> Do not commit your actual database password to GitHub. For a public repository, use environment variables instead.

### 4. Start the backend

From the `backend` directory:

```bash
npm start
```

The backend server runs on:

```text
http://localhost:5000
```

### 5. Start the frontend

Install the required React dependencies in the `frontend` directory and start the React development server:

```bash
cd ../frontend
npm install
npm start
```

The application should then be available at:

```text
http://localhost:3000
```

## Database

The application uses PostgreSQL to store and retrieve university academic data.

The backend interacts with tables including:

* `student`
* `course`
* `instructor`
* `department`
* `takes`
* `teaches`
* `section`
* `prereq`
* `reg_dates`
* `user_password`

The database is queried dynamically through the Node.js backend using PostgreSQL SQL queries.

## Key Learning Outcomes

Through this project, the following concepts were implemented:

* Full-stack web development
* React component-based development
* Client-side routing
* REST API development
* Node.js backend development
* Express.js routing
* PostgreSQL database integration
* SQL queries and relational database operations
* CRUD operations
* Frontend-backend communication
* Database-driven application design

## Future Improvements

* Add secure JWT-based authentication
* Move database credentials to environment variables
* Add role-based authorization
* Add course search and filtering
* Improve form validation
* Add transaction handling for course registration
* Add responsive UI design
* Add automated backend and frontend tests
* Provide a database schema and sample dataset for easier setup
* Deploy the frontend, backend, and database to cloud infrastructure

