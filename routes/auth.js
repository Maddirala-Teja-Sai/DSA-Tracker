const express = require("express");
const bcrypt = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");
const { generateToken, setAuthCookie, clearAuthCookie, requireAuth } = require("../middleware/auth");
const { getIsConnected } = require("../config/db");

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ─── Public Auth Config for Frontend ───
router.get("/config", (req, res) => {
  res.json({
    googleClientId: process.env.GOOGLE_CLIENT_ID || "",
    hasDb: getIsConnected(),
  });
});

// ─── Google Sign-In / Sign-Up ───
router.post("/google", async (req, res) => {
  try {
    if (!getIsConnected()) {
      return res.status(503).json({ error: "Database not connected. Please check MONGODB_URI." });
    }

    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ error: "Google credential token is required" });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    let payload;

    if (clientId) {
      // Production verification against Google Client ID
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: clientId,
      });
      payload = ticket.getPayload();
    } else {
      // In development if client ID is not configured yet, decode JWT payload
      console.warn("⚠️  GOOGLE_CLIENT_ID not set; decoding token payload for development.");
      const jwt = require("jsonwebtoken");
      payload = jwt.decode(credential);
    }

    if (!payload || !payload.email) {
      return res.status(400).json({ error: "Invalid Google token payload" });
    }

    const { sub: googleId, email, name, picture: avatar } = payload;

    // Find user by googleId or email
    let user = await User.findOne({ $or: [{ googleId }, { email: email.toLowerCase() }] });

    if (!user) {
      // New user creation
      user = new User({
        email: email.toLowerCase(),
        name: name || email.split("@")[0],
        avatar: avatar || "",
        googleId,
        authProvider: "google",
        lastLoginAt: new Date(),
      });
      await user.save();
    } else {
      // Existing user update
      user.lastLoginAt = new Date();
      if (!user.googleId) user.googleId = googleId;
      if (avatar && !user.avatar) user.avatar = avatar;
      if (name && !user.name) user.name = name;
      await user.save();
    }

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
    console.error("Google Auth Error:", err);
    res.status(401).json({ error: "Google authentication failed: " + err.message });
  }
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
