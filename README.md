# TaskFlow - Task Management Application

A full-stack MERN (MongoDB, Express, React, Node.js) application for managing and organizing tasks efficiently.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [Database Schema](#database-schema)
- [Contributing](#contributing)

## 🎯 Project Overview

TaskFlow is a comprehensive task management system that allows users to:
- Create, read, update, and delete tasks
- Organize tasks with different statuses
- Set priorities and due dates for tasks
- Manage user accounts with authentication
- Access tasks securely with JWT-based authentication

## ✨ Features

- **User Authentication**: Secure user registration and login with JWT tokens
- **Task Management**: Full CRUD operations for tasks
- **Protected Routes**: Secure routes that require authentication
- **Responsive UI**: Mobile-friendly interface built with React and Tailwind CSS
- **Real-time Notifications**: Toast notifications for user feedback
- **Input Validation**: Backend validation for all inputs
- **Password Encryption**: Secure password hashing using bcrypt
- **CORS Support**: Cross-origin resource sharing enabled

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5.x
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs for password hashing
- **CORS**: Enabled for cross-origin requests

### Frontend
- **Library**: React 19.x
- **Router**: React Router DOM 7.x
- **Styling**: Tailwind CSS 3.x with PostCSS
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Testing**: React Testing Library

## 📦 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14.0 or higher)
- **npm** or **yarn** package manager
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git** (for version control)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd TaskFlow-MERN
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

## ⚙️ Environment Setup

### Backend Configuration

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=8000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/taskflow
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/taskflow

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_make_it_strong
JWT_EXPIRE=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### Frontend Configuration

Create a `.env` file in the `frontend` directory:

```env
REACT_APP_API_URL=http://localhost:8000/api
```

## 🎮 Running the Application

### Start the Backend Server

```bash
cd backend
npm start
# Server will run on http://localhost:8000
```

### Start the Frontend Development Server

In a new terminal:

```bash
cd frontend
npm start
# Application will open at http://localhost:3000
```

### For Production Build

```bash
# Frontend production build
cd frontend
npm run build

# Serve the build
npx serve -s build
```

## 📁 Project Structure

### Backend Structure

```
backend/
├── config/
│   └── db.js                    # MongoDB connection configuration
├── middleware/
│   └── auth.js                  # JWT authentication middleware
├── models/
│   ├── User.js                  # User schema and model
│   └── Task.js                  # Task schema and model
├── routes/
│   ├── authRoutes.js            # Authentication endpoints
│   └── taskRoutes.js            # Task CRUD endpoints
├── package.json                 # Backend dependencies
├── server.js                    # Express server setup
└── .env                         # Environment variables (not in git)
```

### Frontend Structure

```
frontend/
├── public/
│   ├── index.html               # Main HTML file
│   ├── manifest.json            # PWA manifest
│   └── robots.txt               # SEO robots file
├── src/
│   ├── components/
│   │   └── ProtectedRoute.js    # Route protection wrapper
│   ├── context/
│   │   └── authContext.js       # Authentication context
│   ├── pages/
│   │   ├── Login.js             # Login page
│   │   ├── Register.js          # Registration page
│   │   └── Dashboard.js         # Main dashboard page
│   ├── App.js                   # Main App component
│   ├── App.css                  # App styles
│   ├── index.js                 # React entry point
│   ├── index.css                # Global styles
│   └── setupTests.js            # Test configuration
├── package.json                 # Frontend dependencies
├── tailwind.config.js           # Tailwind CSS configuration
├── postcss.config.js            # PostCSS configuration
└── .env                         # Environment variables (not in git)
```

## 🔌 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}

Response: { token, user }
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}

Response: { token, user }
```

### Task Endpoints

#### Get All Tasks
```http
GET /api/tasks
Authorization: Bearer <token>

Response: [{ id, title, description, status, priority, dueDate, createdAt }]
```

#### Create Task
```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Task Title",
  "description": "Task Description",
  "status": "pending",
  "priority": "high",
  "dueDate": "2026-02-23"
}

Response: { id, title, description, status, priority, dueDate, createdAt }
```

#### Update Task
```http
PUT /api/tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "status": "completed"
}

Response: { updated task object }
```

#### Delete Task
```http
DELETE /api/tasks/:id
Authorization: Bearer <token>

Response: { message: "Task deleted successfully" }
```

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. User registers or logs in
2. Server returns a JWT token
3. Token is stored in localStorage (frontend)
4. Token is sent in `Authorization` header for protected routes
5. Backend middleware validates the token
6. If valid, request proceeds; otherwise, returns 401 Unauthorized

### Protected Route Implementation

```javascript
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

## 📊 Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  createdAt: Date (default: current time),
  updatedAt: Date
}
```

### Task Model
```javascript
{
  userId: ObjectId (reference to User),
  title: String (required),
  description: String,
  status: String (enum: 'pending', 'in-progress', 'completed'),
  priority: String (enum: 'low', 'medium', 'high'),
  dueDate: Date,
  createdAt: Date (default: current time),
  updatedAt: Date
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Your Name / Team Name

## 📧 Support

For support, email support@taskflow.com or open an issue in the repository.

## 🗓️ Version

Current Version: 1.0.0

---

**Last Updated**: January 23, 2026
