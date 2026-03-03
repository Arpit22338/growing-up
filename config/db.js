const mongoose = require('mongoose');

let cached = global._mongooseConnection;

const connectDB = async () => {
  if (cached && mongoose.connection.readyState === 1) return cached;
  
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not set');
  }
  
  try {
    cached = await mongoose.connect(uri);
    global._mongooseConnection = cached;
    console.log('MongoDB connected successfully');
    return cached;
  } catch (err) {
    cached = null;
    global._mongooseConnection = null;
    console.error('MongoDB connection error:', err.message);
    throw err;
  }
};

module.exports = connectDB;
