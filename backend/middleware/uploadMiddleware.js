// ============================================================
// middleware/uploadMiddleware.js — Multer File Upload Config
// Handles resume (PDF) and profile picture (image) uploads.
// Validates file types and enforces size limits.
// ============================================================

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ─── Ensure upload directories exist ─────────────────────────
const resumeDir = path.join(__dirname, '../uploads/resumes');
const profileDir = path.join(__dirname, '../uploads/profiles');

if (!fs.existsSync(resumeDir)) fs.mkdirSync(resumeDir, { recursive: true });
if (!fs.existsSync(profileDir)) fs.mkdirSync(profileDir, { recursive: true });

// ─── Storage Engine: Resumes ──────────────────────────────────
const resumeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, resumeDir);
  },
  filename: (req, file, cb) => {
    // Format: userId_timestamp_originalname.pdf
    const uniqueName = `${req.user._id}_${Date.now()}_resume${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// ─── Storage Engine: Profile Pictures ────────────────────────
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, profileDir);
  },
  filename: (req, file, cb) => {
    // Format: userId_timestamp.extension
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${req.user._id}_${Date.now()}_profile${ext}`;
    cb(null, uniqueName);
  },
});

// ─── File Filter: Only PDFs ───────────────────────────────────
const pdfFileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['application/pdf'];
  const allowedExtensions = ['.pdf'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
    cb(null, true); // Accept file
  } else {
    cb(
      new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname),
      false
    );
    // We override the error message in the error handler
    req.fileValidationError = 'Only PDF files are allowed for resumes.';
  }
};

// ─── File Filter: Images Only ─────────────────────────────────
const imageFileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    req.fileValidationError = 'Only JPG, PNG, and WebP images are allowed for profile pictures.';
    cb(null, false); // Reject silently — controller will check req.fileValidationError
  }
};

// ─── Multer Instances ─────────────────────────────────────────

// Resume uploader: max 5MB PDF
const uploadResume = multer({
  storage: resumeStorage,
  fileFilter: pdfFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1,
  },
});

// Profile picture uploader: max 2MB image
const uploadProfilePicture = multer({
  storage: profileStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
    files: 1,
  },
});

// ─── Helper: Delete old file from disk ───────────────────────
const deleteFile = (filePath) => {
  const fullPath = path.join(__dirname, '../', filePath);
  if (fs.existsSync(fullPath)) {
    fs.unlink(fullPath, (err) => {
      if (err) console.error(`Failed to delete file: ${fullPath}`, err.message);
    });
  }
};

// ─── Middleware Wrappers with Error Handling ──────────────────
/**
 * handleResumeUpload — Wraps multer resume upload with proper error forwarding
 */
const handleResumeUpload = (req, res, next) => {
  uploadResume.single('resume')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
          success: false,
          message: 'Resume file is too large. Maximum size is 5MB.',
        });
      }
      return res.status(400).json({
        success: false,
        message: req.fileValidationError || 'File upload error.',
      });
    }
    if (err) return next(err);
    if (req.fileValidationError) {
      return res.status(400).json({
        success: false,
        message: req.fileValidationError,
      });
    }
    next();
  });
};

/**
 * handleProfileUpload — Wraps multer profile picture upload with error forwarding
 */
const handleProfileUpload = (req, res, next) => {
  uploadProfilePicture.single('profilePicture')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
          success: false,
          message: 'Profile picture is too large. Maximum size is 2MB.',
        });
      }
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
    if (err) return next(err);
    if (req.fileValidationError) {
      return res.status(400).json({
        success: false,
        message: req.fileValidationError,
      });
    }
    next();
  });
};

module.exports = {
  handleResumeUpload,
  handleProfileUpload,
  deleteFile,
};
