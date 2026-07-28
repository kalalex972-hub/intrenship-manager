// ============================================================
// routes/adminRoutes.js — Admin Management Routes
// All routes require: valid JWT (protect) + admin role (adminOnly)
//
// GET    /api/admin/dashboard              — Dashboard stats
// GET    /api/admin/applications           — All apps (search/filter)
// GET    /api/admin/applications/:id       — Single application
// PUT    /api/admin/applications/:id       — Update status/notes
// DELETE /api/admin/applications/:id       — Delete application
// GET    /api/admin/users                  — All applicants
// GET    /api/admin/users/:id              — Applicant profile
// GET    /api/admin/reports                — Reports data
// ============================================================

const express = require('express');
const router = express.Router();

// Controllers
const {
  getDashboard,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication,
  getAllUsers,
  getApplicantProfile,
  getReports,
} = require('../controllers/adminController');

// Middleware
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const {
  validateStatusUpdate,
  validateObjectId,
  validate,
} = require('../middleware/validationMiddleware');

// ─── Apply auth + admin guard to ALL routes in this router ────
router.use(protect);
router.use(adminOnly);

// ─── Dashboard ────────────────────────────────────────────────

// @route   GET /api/admin/dashboard
// @desc    Get dashboard statistics (counts, charts, recent apps)
// @access  Admin
router.get('/dashboard', getDashboard);

// ─── Applications Management ──────────────────────────────────

// @route   GET /api/admin/applications
// @desc    Get all applications with search, filter, sort, pagination
// @access  Admin
// Query params: search, status, university, position, dateFrom, dateTo, sort, page, limit
router.get('/applications', getAllApplications);

// @route   GET /api/admin/applications/:id
// @desc    Get full details of a single application
// @access  Admin
router.get('/applications/:id', validateObjectId('id'), validate, getApplicationById);

// @route   PUT /api/admin/applications/:id
// @desc    Update application status and/or add admin notes
// @access  Admin
router.put(
  '/applications/:id',
  validateObjectId('id'),
  validateStatusUpdate,
  validate,
  updateApplicationStatus
);

// @route   DELETE /api/admin/applications/:id
// @desc    Permanently delete an application and its resume file
// @access  Admin
router.delete('/applications/:id', validateObjectId('id'), validate, deleteApplication);

// ─── Users Management ────────────────────────────────────────

// @route   GET /api/admin/users
// @desc    Get all registered applicants with application counts
// @access  Admin
// Query params: search, page, limit
router.get('/users', getAllUsers);

// @route   GET /api/admin/users/:id
// @desc    Get a specific applicant's profile and their applications
// @access  Admin
router.get('/users/:id', validateObjectId('id'), validate, getApplicantProfile);

// ─── Reports ──────────────────────────────────────────────────

// @route   GET /api/admin/reports
// @desc    Get detailed report data (charts, stats, distributions)
// @access  Admin
router.get('/reports', getReports);

module.exports = router;
