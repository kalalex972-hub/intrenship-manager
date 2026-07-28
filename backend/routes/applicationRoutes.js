// ============================================================
// routes/applicationRoutes.js — Applicant Application Routes
// POST   /api/applications          — Submit new application
// GET    /api/applications/my       — Get my applications
// GET    /api/applications/:id      — Get single application
// PUT    /api/applications/:id      — Update application
// DELETE /api/applications/:id      — Delete application
// ============================================================

const express = require('express');
const router = express.Router();

// Controllers
const {
  createApplication,
  getMyApplications,
  getApplication,
  updateApplication,
  deleteApplication,
} = require('../controllers/applicationController');

// Middleware
const { protect } = require('../middleware/authMiddleware');
const { handleResumeUpload } = require('../middleware/uploadMiddleware');
const {
  validateApplication,
  validateObjectId,
  validate,
} = require('../middleware/validationMiddleware');

// All application routes require authentication
router.use(protect);

// ─── Application Routes ───────────────────────────────────────

// @route   POST /api/applications
// @desc    Submit a new internship application (with resume PDF)
// @access  Private (applicant)
// Order: auth → multer upload → validate fields → controller
router.post(
  '/',
  handleResumeUpload,      // Process resume file upload first
  validateApplication,     // Validate form fields
  validate,                // Return errors if validation failed
  createApplication        // Controller
);

// @route   GET /api/applications/my
// @desc    Get all applications submitted by the logged-in user
// @access  Private (applicant)
// NOTE: /my must be defined BEFORE /:id to avoid being caught as an ID
router.get('/my', getMyApplications);

// @route   GET /api/applications/:id
// @desc    Get a single application by ID (owner only)
// @access  Private (applicant)
router.get('/:id', validateObjectId('id'), validate, getApplication);

// @route   PUT /api/applications/:id
// @desc    Update a pending application (with optional new resume)
// @access  Private (applicant — owner only, pending status only)
router.put(
  '/:id',
  validateObjectId('id'),
  validate,
  handleResumeUpload,      // Optional: new resume file
  updateApplication        // Controller
);

// @route   DELETE /api/applications/:id
// @desc    Delete a pending application
// @access  Private (applicant — owner only, pending status only)
router.delete('/:id', validateObjectId('id'), validate, deleteApplication);

module.exports = router;
