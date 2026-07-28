// ============================================================
// middleware/adminMiddleware.js — Role-Based Authorization
// Must be used AFTER the protect middleware.
// Only allows users with role 'admin' to proceed.
// ============================================================

/**
 * adminOnly — Restricts route access to admin users only
 * Usage: router.get('/dashboard', protect, adminOnly, controller)
 */
const adminOnly = (req, res, next) => {
  // req.user is set by the protect middleware
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Not authenticated. Please log in first.',
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access forbidden. Admin privileges required.',
    });
  }

  next();
};

/**
 * authorizeRoles — More flexible role checker (supports multiple roles)
 * Usage: router.get('/route', protect, authorizeRoles('admin', 'manager'), controller)
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated.',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access forbidden. Required role(s): ${roles.join(', ')}.`,
      });
    }

    next();
  };
};

module.exports = { adminOnly, authorizeRoles };
