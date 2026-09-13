const mongoose = require("mongoose");

let isDbConnected = false;

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn("⚠️  MONGODB_URI is not set in environment. Running in local fallback mode.");
    return false;
  }

  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isDbConnected = true;
    console.log("✅ MongoDB connected successfully to database:", mongoose.connection.name);
    return true;
  } catch (err) {
    isDbConnected = false;
    console.warn("⚠️  MongoDB connection error:", err.message);
    console.warn("   The app will continue running. Please check your MONGODB_URI in .env or Render environment.");
    return false;
  }
}

mongoose.connection.on("disconnected", () => {
  isDbConnected = false;
  console.log("ℹ️  MongoDB disconnected");
});

mongoose.connection.on("reconnected", () => {
  isDbConnected = true;
  console.log("✅ MongoDB reconnected");
});

function getIsConnected() {
  return isDbConnected && mongoose.connection.readyState === 1;
}

module.exports = {
  connectDB,
  getIsConnected,
};
