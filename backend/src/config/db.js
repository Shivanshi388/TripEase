const mongoose = require("mongoose");

const connectDB = async () => {
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI is not configured");
  mongoose.set("strictQuery", true);
  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: Number(process.env.MONGO_CONNECT_TIMEOUT_MS) || 10000,
  });
  console.log("MongoDB connected successfully");
};

module.exports = connectDB;
