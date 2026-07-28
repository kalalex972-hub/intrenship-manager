// ============================================================
// middleware/authMiddleware.js — JWT Authentication Guard
// Verifies the Bearer token on every protected route.
// Attaches the decoded user payload to req.user.
// ============================================================

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * protect — Middleware to verify JWT and attach user to request
 * Usage: router.get('/profile', protect, controller)
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // ── Extract token from Authorization header ────────────────
    // Expected format: "Authorization: Bearer <token>"
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // No token found — reject immediately
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided. Please log in.',
      });
    }

    // ── Verify the token ──────────────────────────────────────
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      // Handle specific JWT errors with clear messages
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Session expired. Please log in again.',
        });
      }
      if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token. Please log in again.',
        });
      }
      throw err; // Let the global error handler catch unexpected errors
    }

    // ── Fetch the user from DB ────────────────────────────────
    // This ensures the user still exists and is active
    // We explicitly select password:false (it's excluded by default)
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.',
      });
    }

    // Check if user account is still active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.',
      });
    }

    // ── Attach user to request object ─────────────────────────
    req.user = user;
    next();

  } catch (error) {
    next(error); // Pass to global error handler
  }
};

module.exports = { protect };
