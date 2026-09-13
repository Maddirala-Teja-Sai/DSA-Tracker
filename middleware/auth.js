const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "dsa_tracker_default_jwt_secret_change_me";
const COOKIE_NAME = "dsa_token";
const ONE_MONTH_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function generateToken(userId) {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "30d" });
}

function setAuthCookie(res, token) {
  const isProduction = process.env.NODE_ENV === "production";
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    maxAge: ONE_MONTH_MS,
    path: "/",
  });
}

function clearAuthCookie(res) {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
}

async function requireAuth(req, res, next) {
  try {
    const token = req.cookies[COOKIE_NAME] || (req.headers.authorization && req.headers.authorization.split(" ")[1]);
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: Please log in" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      clearAuthCookie(res);
      return res.status(401).json({ error: "User session not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    clearAuthCookie(res);
    return res.status(401).json({ error: "Session expired. Please log in again." });
  }
}

async function optionalAuth(req, res, next) {
  try {
    const token = req.cookies[COOKIE_NAME] || (req.headers.authorization && req.headers.authorization.split(" ")[1]);
    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (user) req.user = user;
    }
  } catch {}
  next();
}

module.exports = {
  generateToken,
  setAuthCookie,
  clearAuthCookie,
  requireAuth,
  optionalAuth,
  ONE_MONTH_MS,
};
