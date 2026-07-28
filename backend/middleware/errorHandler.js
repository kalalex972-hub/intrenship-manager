// ============================================================
// middleware/errorHandler.js — Global Express Error Handler
// Catches all errors forwarded via next(error).
// Returns consistent JSON error responses.
// ============================================================

/**
 * errorHandler — Must be the LAST middleware registered in server.js
 * Express identifies it as an error handler because it has 4 parameters (err, req, res, next)
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = [];

  // ── Log error in development ──────────────────────────────
  if (process.env.NODE_ENV === 'development') {
    console.error('🔥 Error:', err);
  }

  // ── Mongoose Validation Error ─────────────────────────────
  // Triggered when a document fails schema validation on .save()
  if (err.name === 'ValidationError') {
    statusCode = 422;
    message = 'Validation failed';
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // ── Mongoose Duplicate Key Error ──────────────────────────
  // Triggered when inserting a document that violates a unique index
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} '${value}' is already registered.`;
    errors = [{ field, message }];
  }

  // ── Mongoose CastError (invalid ObjectId) ─────────────────
  // Triggered when a route receives an invalid MongoDB _id format
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: '${err.value}' is not a valid ID.`;
  }

  // ── JWT Errors (caught here as backup) ────────────────────
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token. Please log in again.';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Session expired. Please log in again.';
  }

  // ── Multer File Size Error ─────────────────────────────────
  if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 413;
    message = 'File too large. Maximum allowed size is 5MB.';
  }

  // ── Multer Unexpected Field ───────────────────────────────
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    statusCode = 400;
    message = `Unexpected file field: '${err.field}'.`;
  }

  // ── Build final response ──────────────────────────────────
  const response = {
    success: false,
    message,
    ...(errors.length > 0 && { errors }), // Only include if there are field errors
    // Include stack trace only in development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  res.status(statusCode).json(response);
};

/**
 * asyncHandler — Wraps async route handlers to avoid try/catch repetition
 * Usage: router.get('/route', asyncHandler(async (req, res) => { ... }))
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = errorHandler;
module.exports.asyncHandler = asyncHandler;
