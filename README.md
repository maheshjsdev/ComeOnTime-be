# MongoDB Node.js Project

This project is a Node.js REST API using Express.js and MongoDB. It includes basic CRUD operations and MongoDB connection setup.

## Features
- Express.js server
- MongoDB connection
- Example model (User)
- CRUD API endpoints

## Setup
1. Install dependencies:
   ```powershell
   npm install
   ```
2. Start the server:
   ```powershell
   npm start
   ```
3. Update MongoDB URI in `.env` if needed.

## Endpoints
- `GET /users` - List users
- `POST /users` - Create user
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

## Notes
- Replace example model and endpoints as needed for your application.
