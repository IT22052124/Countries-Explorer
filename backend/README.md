# 🌎 Countries Explorer API

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-v16+-green.svg)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-v4.18-lightgrey.svg)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-v5.0+-darkgreen.svg)](https://www.mongodb.com)
[![Test Coverage](https://img.shields.io/badge/coverage-85%25-brightgreen.svg)](https://jestjs.io/)

> A powerful RESTful API for the Countries Explorer application that enables seamless user authentication and favorite countries management. Built with Node.js, Express, and MongoDB.

<p align="center">
  <img src="https://via.placeholder.com/800x400?text=Countries+Explorer+API" alt="Countries Explorer API Banner" width="800">
</p>

## ✨ Features

- **🔐 User Authentication** - Secure register, login, and logout functionality
- **👤 User Profiles** - Complete user profile management
- **❤️ Favorites System** - Add, retrieve, and manage favorite countries
- **🔑 JWT Authentication** - Secure token-based authentication system
- **🔒 Password Encryption** - Bcrypt hashing for maximum security
- **🗄️ MongoDB Database** - Flexible and scalable data storage
- **🧪 Comprehensive Testing** - Jest and Supertest integration
- **📝 Detailed API Documentation** - Swagger UI integration
- **🔄 CORS Support** - Seamless frontend-backend integration

## 🚀 Technologies Used

<p align="center">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" width="50" height="50" alt="Node.js">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" width="50" height="50" alt="Express">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" width="50" height="50" alt="MongoDB">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jest/jest-plain.svg" width="50" height="50" alt="Jest">
</p>

- **Node.js** - JavaScript runtime for building server-side applications
- **Express** - Fast, unopinionated, minimalist web framework for Node.js
- **MongoDB** - Document-oriented NoSQL database
- **Mongoose** - Elegant MongoDB object modeling for Node.js
- **JSON Web Tokens (JWT)** - Secure authentication mechanism
- **bcryptjs** - Password hashing library
- **cookie-parser** - Parse Cookie header and populate req.cookies
- **cors** - Enable Cross-Origin Resource Sharing
- **dotenv** - Environment variable management
- **Jest & Supertest** - Testing frameworks for API validation

## 📋 Requirements

- Node.js (v16 or later)
- npm or yarn package manager
- MongoDB database (Atlas)

## 🔧 Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/IT22052124/countries-explorer-api.git
cd countries-explorer-api
```

### 2. Install dependencies

```bash
npm install
# or with yarn
yarn install
```

### 3. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:3000
```

### 4. Start the development server

```bash
npm run dev
# or with yarn
yarn dev
```

The server will start on port 5000 (or the port specified in your .env file).

## 📜 Available Scripts

| Command                 | Description                              |
| ----------------------- | ---------------------------------------- |
| `npm start`             | Start the production server              |
| `npm run dev`           | Start development server with hot reload |
| `npm test`              | Run the test suite                       |
| `npm run test:watch`    | Run tests in watch mode                  |
| `npm run test:coverage` | Generate test coverage report            |

## 📁 Project Structure

```
countries-explorer-api/
├── src/
│   ├── controllers/
│   │   ├── auth.js        # Authentication controller
│   │   ├── user.js        # User management controller
│   │   └── favorites.js   # Favorites controller
│   ├── middleware/
│   │   ├── auth.js        # JWT authentication middleware
│   ├── models/
│   │   ├── User.js        # User data model
│   │   └── Favorite.js    # Favorite country model
│   ├── routes/
│   │   ├── auth.js        # Authentication routes
│   │   ├── user.js        # User routes
│   │   └── favorites.js   # Favorites routes
│   ├── utils/
│   │   ├── errorResponse.js  # Error response utility
│   │   └── validateEnv.js    # Environment validation
│   ├── app.js            # Express application setup
│   └── server.js         # Server entry point
├── tests/
│   ├── integration/      # API integration tests
│   └── unit/             # Unit tests
├── .env                  # Environment variables
├── .gitignore            # Git ignore file
├── app.js
├── index.js
<!-- ├── jest.config.js        # Jest configuration -->
├── package.json          # Project dependencies and scripts
└── README.md             # Project documentation
```

## 🌐 API Endpoints

### Authentication

| Method | Endpoint             | Description       | Access  |
| ------ | -------------------- | ----------------- | ------- |
| POST   | `/api/auth/register` | Register new user | Public  |
| POST   | `/api/auth/login`    | Login user        | Public  |
| GET    | `/api/auth/logout`   | Logout user       | Private |
| GET    | `/api/auth/me`       | Get current user  | Private |

### User Management

| Method | Endpoint              | Description         | Access  |
| ------ | --------------------- | ------------------- | ------- |
| PUT    | `/api/users/profile`  | Update user profile | Private |
| PUT    | `/api/users/password` | Change password     | Private |
| DELETE | `/api/users/account`  | Delete account      | Private |

### Favorites Management

| Method | Endpoint                      | Description                   | Access  |
| ------ | ----------------------------- | ----------------------------- | ------- |
| GET    | `/api/favorites`              | Get all favorites             | Private |
| POST   | `/api/favorites`              | Add country to favorites      | Private |
| GET    | `/api/favorites/:countryCode` | Check if country is favorited | Private |
| DELETE | `/api/favorites/:countryCode` | Remove from favorites         | Private |

## 🧪 Testing

The API uses Jest and Supertest for comprehensive testing, with MongoDB Memory Server to create an in-memory MongoDB instance.

Run the test suite:

```bash
npm test
```

Generate test coverage report:

```bash
npm run test:coverage
```

## 🔒 Security Features

- Passwords are securely hashed using bcryptjs
- JWT tokens for stateless authentication
- HTTP-only cookies for enhanced security
- CORS protection configured for specific origins
- Rate limiting to prevent brute force attacks
- Helmet.js for securing HTTP headers
- Input validation and sanitization
- XSS protection
- Comprehensive error handling

## 📦 Deployment

### Production Setup

Set the `NODE_ENV` environment variable to `production`:

```bash
NODE_ENV=production npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


<p align="center">
  Made with ❤️ by Shukry (DedSec)
</p>
