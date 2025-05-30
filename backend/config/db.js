const mongoose = require('mongoose');
const dns = require('dns');
require('dotenv').config();

// Force IPv4 DNS resolution (helps with mobile hotspot networks)
dns.setDefaultResultOrder('ipv4first');

// Enable debug logs for Mongoose
mongoose.set('debug', true);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      family: 4, // Force IPv4 stack
      serverSelectionTimeoutMS: 5000,
    });

    console.log('✅ MongoDB connected successfully!');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;