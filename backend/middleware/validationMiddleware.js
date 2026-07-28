// ============================================================
// middleware/validationMiddleware.js — express-validator rules
// Contains validation chains for all API endpoints.
// Use validate() at the end to collect and return errors.
// ============================================================

const { body, param, query, validationResult } = require('express-validator');

// ─── Validation Result Handler ────────────────────────────────
/**
 * validate — Checks for validation errors and returns 422 if any exist
 * Always place this LAST in the middleware chain for a route
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));

    return res.status(422).json({
      success: false,
      message: 'Validation failed. Please check your input.',
      errors: formattedErrors,
    });
  }
  next();
};

// ─── Auth Validation Rules ────────────────────────────────────

const validateRegister = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3, max: 30 }).withMessage('Username must be 3–30 characters')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores'),

  body('fullName')
    .trim()
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Full name must be 2–100 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),

  body('phone')
    .optional()
    .trim()
    .matches(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/)
    .withMessage('Please enter a valid phone number'),
];

const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required'),
];

const validateUpdateProfile = [
  body('fullName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Full name must be 2–100 characters'),

  body('phone')
    .optional()
    .trim()
    .matches(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/)
    .withMessage('Please enter a valid phone number'),

  body('currentPassword')
    .optional()
    .isLength({ min: 8 }).withMessage('Current password must be at least 8 characters'),

  body('newPassword')
    .optional()
    .isLength({ min: 8 }).withMessage('New password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain uppercase, lowercase, and a number'),
];

// ─── Application Validation Rules ────────────────────────────

const VALID_POSITIONS = [
  'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
  'Mobile Developer', 'UI/UX Designer', 'Data Analyst',
  'Machine Learning Engineer', 'DevOps Engineer', 'Cybersecurity Analyst',
  'Product Manager', 'Business Analyst', 'Marketing Intern',
  'Human Resources Intern', 'Finance Intern', 'Other',
];

const validateApplication = [
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .matches(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/)
    .withMessage('Please enter a valid phone number'),

  body('university')
    .trim()
    .notEmpty().withMessage('University name is required')
    .isLength({ max: 150 }).withMessage('University name cannot exceed 150 characters'),

  body('department')
    .trim()
    .notEmpty().withMessage('Department is required')
    .isLength({ max: 100 }).withMessage('Department cannot exceed 100 characters'),

  body('cgpa')
    .notEmpty().withMessage('CGPA is required')
    .isFloat({ min: 0, max: 4 }).withMessage('CGPA must be between 0 and 4.0'),

  body('position')
    .trim()
    .notEmpty().withMessage('Position is required')
    .isIn(VALID_POSITIONS).withMessage('Please select a valid position'),

  body('skills')
    .optional()
    .custom((value) => {
      if (Array.isArray(value)) return value.length <= 20;
      if (typeof value === 'string') {
        try {
          const parsed = JSON.parse(value);
          return Array.isArray(parsed) && parsed.length <= 20;
        } catch {
          return false;
        }
      }
      return false;
    })
    .withMessage('Skills must be an array with a maximum of 20 items'),

  body('coverLetter')
    .trim()
    .notEmpty().withMessage('Cover letter is required')
    .isLength({ min: 100, max: 2000 })
    .withMessage('Cover letter must be between 100 and 2000 characters'),
];

// ─── Admin Validation Rules ────────────────────────────────────

const validateStatusUpdate = [
  body('status')
    .trim()
    .notEmpty().withMessage('Status is required')
    .isIn(['pending', 'reviewed', 'accepted', 'rejected'])
    .withMessage('Status must be pending, reviewed, accepted, or rejected'),

  body('adminNotes')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Admin notes cannot exceed 500 characters'),
];

// ─── Param Validation ─────────────────────────────────────────

const validateObjectId = (paramName = 'id') => [
  param(paramName)
    .isMongoId().withMessage(`Invalid ${paramName} format`),
];

module.exports = {
  validate,
  validateRegister,
  validateLogin,
  validateUpdateProfile,
  validateApplication,
  validateStatusUpdate,
  validateObjectId,
};
