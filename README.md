# Full Stack Application

## Overview
This is a full-stack web application built using React for the frontend and Node.js with GraphQL for the backend. It includes user authentication and real-time sign-in count updates.

## Features
- User Registration and Login
- JWT-based Authentication
- Real-time Sign-In Count Updates
- Responsive UI with Material-UI

## Prerequisites
- Node.js (>=14.x)
- npm or yarn
- SQLite

## Setup

### Clone the Repository
```sh
git clone https://github.com/Nikagagua/tech-task.git
cd tech-task


# Full Stack Application

## Overview
This is a full-stack web application built using React for the frontend and Node.js with GraphQL for the backend. It includes user authentication and real-time sign-in count updates.

## Features
- User Registration and Login
- JWT-based Authentication
- Real-time Sign-In Count Updates
- Responsive UI with Material-UI

## Prerequisites
- Node.js (>=14.x)
- npm or yarn
- SQLite

## Setup

### Clone the Repository
```sh
git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name
```

### Backend Setup

1. Navigate to the backend directory
cd backend

2. Install the dependencies
npm install

3. Create a `.env` file in the `backend` directory and add the following environment variables:
JWT_SECRET=your_secret_key
DATABASE_URL=sqlite:./database.sqlite
PORT=4000

4. Run the backend server
npm start

The backend server will start on `http://localhost:4000`.


### Frontend Setup

1. Navigate to the frontend directory
cd frontend

2. Install the dependencies
npm install

3. Create a `.env` file in the `frontend` directory and add the following environment variable:
REACT_APP_GRAPHQL_ENDPOINT=http://localhost:4000/graphql

4. Run the frontend development server
npm start

The frontend server will start on `http://localhost:3000`.

## Project Structure
tech-task/
  backend/
    src/
      auth.mjs
      index.mjs
      init.mjs
      models.mjs
      resolvers.mjs
      schema.mjs
    .env
    package.json
    package-lock.json
  frontend/
    public/
    src/
      components/
        Dashboard.js
        Home.js
        Login.js
        Register.js
        UserContext.js
      ApolloProvider.js
      App.js
      index.js
      .env
      package.json
      package-lock.json

## Testing
Ensure both backend and frontend servers are running and use the application through `http://localhost:3000`.
