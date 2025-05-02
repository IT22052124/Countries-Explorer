[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/mNaxAqQD)

# Countries Explorer

A full-stack web application that allows users to explore countries around the world, filter by region and language, and save their favorite countries. The project consists of a frontend built with Next.js and a backend API built with Express and MongoDB.

## Project Overview

Countries Explorer is a web application that provides an intuitive interface for exploring information about countries around the world. Users can search for countries, filter by region and language, view detailed information about specific countries, and save their favorite countries for later reference.

## Project Structure

- **countries-explorer/** - Frontend Next.js application
- **backend/** - Backend Express API server

## Quick Start

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:

   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLIENT_URL=http://localhost:3000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd countries-explorer
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file with the following variables:

   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Features

### Frontend Features

- Search for countries by name
- Filter countries by region and language
- View detailed information about specific countries
- User authentication (register, login, logout)
- Add countries to favorites (for logged-in users)
- Responsive design with dark mode support
- Testing with Jest and React Testing Library

### Backend Features

- RESTful API for user management
- MongoDB database for storing user data and favorites
- JWT-based authentication
- User profile management
- Favorite countries management
- API testing with Jest and Supertest

## Technologies Used

### Frontend

- Next.js 15
- React 19
- Tailwind CSS
- Axios for API requests
- SWR for data fetching
- Jest and React Testing Library for testing

### Backend

- Node.js
- Express
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing
- Jest and Supertest for testing

## Running Tests

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd countries-explorer
npm test
```

## Detailed Documentation

For more details, please check the README files in the respective directories:

- [Frontend Documentation](./countries-explorer/README.md)
- [Backend Documentation](./backend/README.md)
- [Project Report](./REPORT.md)

## Challenges and Solutions

### API Integration

**Challenge:** Integrating multiple endpoints from the REST Countries API and handling data consistently.

**Solution:** Created a centralized API utility with dedicated functions for different endpoints, with robust error handling and data normalization.

### User Authentication

**Challenge:** Implementing secure user authentication across frontend and backend.

**Solution:** Used JWT tokens with HTTP-only cookies and local storage for client-side state management, with proper validation and error handling throughout the authentication flow.

### State Management

**Challenge:** Managing application state across multiple components, especially for filters and favorites.

**Solution:** Used React hooks (useState, useEffect) for local state and passed state up to parent components when needed. Used localStorage for persisting user data between page refreshes.

### Responsive Design

**Challenge:** Ensuring the application works well on devices of all sizes.

**Solution:** Used Tailwind CSS's responsive utilities to create different layouts for mobile, tablet, and desktop screens.

## Future Improvements

- Implement caching for API responses
- Add more filter options (currency, population, etc.)
- Implement a global state management solution
- Add more comprehensive testing
- Add a map view for countries
