const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  return new Promise((resolve, reject) => {
    const attemptConnection = async () => {
      try {
        await mongoose.connect(process.env.mongodb, {
          retryWrites: true,
          w: 'majority',
          serverSelectionTimeoutMS: 15000,
          connectTimeoutMS: 15000,
          socketTimeoutMS: 45000,
        });
        console.log("✅ MongoDB Connected Successfully");
        resolve(mongoose.connection);
      } catch (error) {
        console.error("❌ MongoDB Connection Error:", error.message);
        console.log("🔄 Retrying connection in 5 seconds...");
        setTimeout(attemptConnection, 5000);
      }
    };
    attemptConnection();
  });
};

module.exports = connectDB;
