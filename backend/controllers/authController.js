// ============================================================
// controllers/authController.js — Authentication Logic
// register, login, getProfile, updateProfile
// ============================================================

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { deleteFile } = require('../middleware/uploadMiddleware');

// ─── Helper: Generate JWT ─────────────────────────────────────
const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// ─── Helper: Build user response object ──────────────────────
const buildUserResponse = (user) => ({
  _id: user._id,
  username: user.username,
  fullName: user.fullName,
  email: user.email,
  phone: user.phone,
  profilePicture: user.profilePicture,
  role: user.role,
  isActive: user.isActive,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

// ============================================================
// @desc    Register a new applicant
// @route   POST /api/auth/register
// @access  Public
// ============================================================
const register = async (req, res, next) => {
  try {
    const { username, fullName, email, password, phone } = req.body;

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(409).json({
        success: false,
        message: 'This username is already taken.',
      });
    }

    // Create user — password is hashed via pre-save hook in User model
    const user = await User.create({
      username,
      fullName,
      email,
      password,
      phone: phone || '',
      role: 'applicant', // Force role to applicant on public registration
    });

    // Generate JWT token
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome aboard.',
      token,
      user: buildUserResponse(user),
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// @desc    Login user (applicant or admin)
// @route   POST /api/auth/login
// @access  Public
// ============================================================
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user and explicitly include password (select: false in schema)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      // Use generic message to prevent email enumeration attacks
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.',
      });
    }

    // Compare password with stored hash
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Generate token
    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token,
      user: buildUserResponse(user),
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// @desc    Get current logged-in user profile
// @route   GET /api/auth/profile
// @access  Private (requires valid JWT)
// ============================================================
const getProfile = async (req, res, next) => {
  try {
    // req.user is attached by the protect middleware
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    res.status(200).json({
      success: true,
      user: buildUserResponse(user),
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// @desc    Update user profile (name, phone, password, picture)
// @route   PUT /api/auth/profile
// @access  Private
// ============================================================
const updateProfile = async (req, res, next) => {
  try {
    const { fullName, phone, currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    // Find user (include password for change verification)
    const user = await User.findById(userId).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // ── Update basic fields ───────────────────────────────────
    if (fullName) user.fullName = fullName.trim();
    if (phone !== undefined) user.phone = phone.trim();

    // ── Handle password change ────────────────────────────────
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: 'Please provide your current password to set a new one.',
        });
      }

      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Current password is incorrect.',
        });
      }

      user.password = newPassword; // Will be hashed by pre-save hook
    }

    // ── Handle profile picture upload ─────────────────────────
    if (req.file) {
      // Delete old profile picture from disk if it exists
      if (user.profilePicture) {
        deleteFile(user.profilePicture);
      }
      // Store relative path (served statically via /uploads)
      user.profilePicture = `uploads/profiles/${req.file.filename}`;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: buildUserResponse(user),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getProfile, updateProfile };
