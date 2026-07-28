// ============================================================
// routes/authRoutes.js — Authentication Routes
// POST /api/auth/register
// POST /api/auth/login
// GET  /api/auth/profile
// PUT  /api/auth/profile
// ============================================================

const express = require('express');
const router = express.Router();

// Controllers
const { register, login, getProfile, updateProfile } = require('../controllers/authController');

// Middleware
const { protect } = require('../middleware/authMiddleware');
const { handleProfileUpload } = require('../middleware/uploadMiddleware');
const {
  validateRegister,
  validateLogin,
  validateUpdateProfile,
  validate,
} = require('../middleware/validationMiddleware');

// ─── Public Routes ────────────────────────────────────────────

// @route   POST /api/auth/register
// @desc    Register a new applicant account
// @access  Public
router.post('/register', validateRegister, validate, register);

// @route   POST /api/auth/login
// @desc    Login with email and password, returns JWT
// @access  Public
router.post('/login', validateLogin, validate, login);

// ─── Protected Routes (require valid JWT) ─────────────────────

// @route   GET /api/auth/profile
// @desc    Get the currently authenticated user's profile
// @access  Private
router.get('/profile', protect, getProfile);

// @route   PUT /api/auth/profile
// @desc    Update profile (name, phone, password, profile picture)
// @access  Private
// handleProfileUpload runs multer BEFORE validation so req.file is available
router.put(
  '/profile',
  protect,
  handleProfileUpload,       // Multer: processes profilePicture file field
  validateUpdateProfile,     // Validate text fields
  validate,                  // Return errors if any
  updateProfile              // Controller
);

module.exports = router;
