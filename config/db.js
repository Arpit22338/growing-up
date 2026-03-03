const mongoose = require('mongoose');
require('dotenv').config();

let cached = global._mongooseConnection;

const connectDB = async () => {
  if (cached) return cached;
  try {
    cached = await mongoose.connect(process.env.MONGODB_URI);
    global._mongooseConnection = cached;
    console.log('MongoDB connected successfully');
    return cached;
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    throw err;
  }
};

module.exports = connectDB;
