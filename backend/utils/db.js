const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('MongoDB: Using existing connection');
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Connection pooling settings for serverless
      maxPoolSize: 10,
      minPoolSize: 2,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 10000,
    });

    isConnected = db.connections[0].readyState === 1;
    console.log('MongoDB: Connected successfully');
  } catch (error) {
    console.error('MongoDB: Connection error:', error);
    throw error;
  }
};

module.exports = connectDB;
