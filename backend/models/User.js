// ============================================================
// models/User.js — Mongoose schema for the Users collection
// Handles password hashing, role management, and profile data
// ============================================================

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    // ── Identity ─────────────────────────────────────────────
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
      match: [
        /^[a-zA-Z0-9_]+$/,
        'Username can only contain letters, numbers, and underscores',
      ],
    },

    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Full name must be at least 2 characters'],
      maxlength: [100, 'Full name cannot exceed 100 characters'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true, // Store emails in lowercase always
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address',
      ],
    },

    // ── Security ──────────────────────────────────────────────
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // NEVER return password in queries by default
    },

    // ── Contact ───────────────────────────────────────────────
    phone: {
      type: String,
      trim: true,
      default: '',
      match: [
        /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
        'Please enter a valid phone number',
      ],
    },

    // ── Media ─────────────────────────────────────────────────
    profilePicture: {
      type: String,
      default: '', // Empty string means no picture uploaded yet
    },

    // ── Authorization ─────────────────────────────────────────
    role: {
      type: String,
      enum: {
        values: ['applicant', 'admin'],
        message: 'Role must be either applicant or admin',
      },
      default: 'applicant',
    },

    // ── Status ────────────────────────────────────────────────
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true,
    // Remove __v (version key) from documents
    versionKey: false,
  }
);

// ─── Indexes ──────────────────────────────────────────────────
// Compound index for faster lookups on email + role
userSchema.index({ email: 1, role: 1 });
userSchema.index({ username: 1 });
userSchema.index({ createdAt: -1 }); // Sort by newest first

// ─── Pre-Save Hook: Hash Password ─────────────────────────────
// Runs BEFORE every .save() — only re-hashes if password was changed
userSchema.pre('save', async function (next) {
  // If password field was not modified, skip hashing
  if (!this.isModified('password')) return next();

  try {
    // Salt rounds: 12 is a good balance of security vs performance
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// ─── Instance Method: Compare Password ───────────────────────
// Used during login to verify the entered password against the hash
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ─── Instance Method: Get Public Profile ─────────────────────
// Returns a safe object without sensitive fields
userSchema.methods.toPublicJSON = function () {
  return {
    _id: this._id,
    username: this.username,
    fullName: this.fullName,
    email: this.email,
    phone: this.phone,
    profilePicture: this.profilePicture,
    role: this.role,
    isActive: this.isActive,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

// ─── Transform: Strip Password from JSON Output ───────────────
// Even if someone accidentally includes the password field,
// it won't appear in the JSON response
userSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret.password;
    return ret;
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
