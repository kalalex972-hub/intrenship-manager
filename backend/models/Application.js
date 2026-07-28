// ============================================================
// models/Application.js — Mongoose schema for Applications
// References User model, stores internship application data
// ============================================================

const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    // ── Reference to Applicant ────────────────────────────────
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',           // Populates with User document
      required: [true, 'Applicant reference is required'],
    },

    // ── Contact ───────────────────────────────────────────────
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [
        /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
        'Please enter a valid phone number',
      ],
    },

    // ── Academic Information ──────────────────────────────────
    university: {
      type: String,
      required: [true, 'University name is required'],
      trim: true,
      maxlength: [150, 'University name cannot exceed 150 characters'],
    },

    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
      maxlength: [100, 'Department cannot exceed 100 characters'],
    },

    cgpa: {
      type: Number,
      required: [true, 'CGPA is required'],
      min: [0, 'CGPA cannot be less than 0'],
      max: [4, 'CGPA cannot exceed 4.0'],
    },

    // ── Internship Details ────────────────────────────────────
    position: {
      type: String,
      required: [true, 'Position applied for is required'],
      trim: true,
      enum: {
        values: [
          'Frontend Developer',
          'Backend Developer',
          'Full Stack Developer',
          'Mobile Developer',
          'UI/UX Designer',
          'Data Analyst',
          'Machine Learning Engineer',
          'DevOps Engineer',
          'Cybersecurity Analyst',
          'Product Manager',
          'Business Analyst',
          'Marketing Intern',
          'Human Resources Intern',
          'Finance Intern',
          'Other',
        ],
        message: 'Please select a valid position',
      },
    },

    // ── Skills ────────────────────────────────────────────────
    skills: {
      type: [String],
      default: [],
      validate: {
        validator: function (arr) {
          return arr.length <= 20; // Max 20 skills
        },
        message: 'You can add a maximum of 20 skills',
      },
    },

    // ── Application Content ───────────────────────────────────
    coverLetter: {
      type: String,
      required: [true, 'Cover letter is required'],
      minlength: [100, 'Cover letter must be at least 100 characters'],
      maxlength: [2000, 'Cover letter cannot exceed 2000 characters'],
      trim: true,
    },

    // ── File Upload ───────────────────────────────────────────
    resume: {
      type: String, // Stores the file path/name on the server
      required: [true, 'Resume (PDF) is required'],
      default: '',
    },

    // ── Application Status ────────────────────────────────────
    status: {
      type: String,
      enum: {
        values: ['pending', 'reviewed', 'accepted', 'rejected'],
        message: 'Status must be pending, reviewed, accepted, or rejected',
      },
      default: 'pending',
    },

    // ── Admin Notes (optional internal note by admin) ─────────
    adminNotes: {
      type: String,
      default: '',
      maxlength: [500, 'Admin notes cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
    // Enable virtual fields in JSON/Object output
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Indexes ──────────────────────────────────────────────────
// One applicant can only have ONE active application per position
applicationSchema.index({ applicant: 1, position: 1 }, { unique: true });

// Frequently filtered/sorted fields
applicationSchema.index({ status: 1 });
applicationSchema.index({ university: 1 });
applicationSchema.index({ position: 1 });
applicationSchema.index({ cgpa: -1 });
applicationSchema.index({ createdAt: -1 });

// Text index for search (name/email handled via populate, these are direct fields)
applicationSchema.index({ university: 'text', position: 'text', department: 'text' });

// ─── Static Method: Get Status Counts ─────────────────────────
// Used by admin dashboard to get counts for each status at once
applicationSchema.statics.getStatusCounts = async function () {
  const result = await this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  // Convert array to object: { pending: 5, accepted: 3, ... }
  const counts = {
    total: 0,
    pending: 0,
    reviewed: 0,
    accepted: 0,
    rejected: 0,
  };

  result.forEach((item) => {
    counts[item._id] = item.count;
    counts.total += item.count;
  });

  return counts;
};

// ─── Static Method: Monthly Applications (for chart) ──────────
// Returns application counts grouped by month for the past 12 months
applicationSchema.statics.getMonthlyStats = async function () {
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
  twelveMonthsAgo.setDate(1);
  twelveMonthsAgo.setHours(0, 0, 0, 0);

  return this.aggregate([
    {
      $match: {
        createdAt: { $gte: twelveMonthsAgo },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);
};

// ─── Static Method: Top Universities ──────────────────────────
applicationSchema.statics.getTopUniversities = async function (limit = 5) {
  return this.aggregate([
    {
      $group: {
        _id: '$university',
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: limit },
    { $project: { university: '$_id', count: 1, _id: 0 } },
  ]);
};

// ─── Static Method: Most Applied Positions ────────────────────
applicationSchema.statics.getTopPositions = async function (limit = 5) {
  return this.aggregate([
    {
      $group: {
        _id: '$position',
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: limit },
    { $project: { position: '$_id', count: 1, _id: 0 } },
  ]);
};

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
