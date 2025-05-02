const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("../app");
const serverless = require("serverless-http");

// Load environment variables
dotenv.config();

// Connect to MongoDB
let cachedDb = null;

const connectToDatabase = async () => {
  if (cachedDb) {
    return cachedDb;
  }

  try {
    const db = await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/countries-explorer"
    );
    cachedDb = db;
    console.log("Connected to MongoDB");
    return db;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

// Connect to the database before handling requests
const handler = serverless(app);

module.exports = async (req, res) => {
  await connectToDatabase();
  return handler(req, res);
};
