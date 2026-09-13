const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { generateToken, setAuthCookie, clearAuthCookie, requireAuth } = require("../middleware/auth");
const { getIsConnected } = require("../config/db");

const router = express.Router();

// ─── Public Auth Config for Frontend ───
router.get("/config", (req, res) => {
  res.json({
    hasDb: getIsConnected(),
  });
});

// ─── Email & Password Sign-Up ───
router.post("/signup", async (req, res) => {
  try {
    if (!getIsConnected()) {
      return res.status(503).json({ error: "Database not connected. Please check MONGODB_URI." });
    }

    const { email, password, name } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ error: "An account with this email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({
      email: email.toLowerCase(),
      name: name ? name.trim() : email.split("@")[0],
      passwordHash,
      authProvider: "local",
      lastLoginAt: new Date(),
    });
    await user.save();

    // 1-month session cookie
    const token = generateToken(user._id);
    setAuthCookie(res, token);

    res.status(201).json({
      user: user.toSafeObject(),
      hasCloudData: false,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Error creating account" });
  }
});

// ─── Email & Password Login ───
router.post("/login", async (req, res) => {
  try {
    if (!getIsConnected()) {
      return res.status(503).json({ error: "Database not connected. Please check MONGODB_URI." });
    }

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (!user.passwordHash) {
      return res.status(400).json({
        error: "This account was created with Google Sign-In. Please click 'Sign in with Google'.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Refresh last login timestamp
    user.lastLoginAt = new Date();
    await user.save();

    // 1-month session cookie
    const token = generateToken(user._id);
    setAuthCookie(res, token);

    const hasData = Boolean(
      (user.trackerData.solved && user.trackerData.solved.length > 0) ||
      (user.trackerData.starred && user.trackerData.starred.length > 0) ||
      (user.trackerData.customQuestions && user.trackerData.customQuestions.length > 0)
    );

    res.json({
      user: user.toSafeObject(),
      hasCloudData: hasData,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Error logging in" });
  }
});

// ─── Current User Profile ───
router.get("/me", requireAuth, (req, res) => {
  res.json({
    user: req.user.toSafeObject(),
  });
});

// ─── Logout ───
router.post("/logout", (req, res) => {
  clearAuthCookie(res);
  res.json({ success: true, message: "Logged out successfully" });
});

module.exports = router;
