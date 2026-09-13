require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const { connectDB } = require("./config/db");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/userData");

const app = express();
const PORT = process.env.PORT || 3000;

// Body parser & Cookie parser
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  const { getIsConnected } = require("./config/db");
  res.json({
    status: "ok",
    database: getIsConnected() ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

// Alias for auth config
app.get("/api/config/auth", (_req, res) => {
  const { getIsConnected } = require("./config/db");
  res.json({
    googleClientId: process.env.GOOGLE_CLIENT_ID || "",
    hasDb: getIsConnected(),
  });
});

// Serve static assets
app.use(express.static(path.join(__dirname)));

// SPA fallback — always serve index.html for any client routes
app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Connect to MongoDB and start listening
connectDB().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 DSA Tracker running at http://localhost:${PORT}`);
  });
});
