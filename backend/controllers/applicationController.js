// ============================================================
// controllers/applicationController.js — Applicant Logic
// createApplication, getMyApplications, getApplication,
// updateApplication, deleteApplication
// ============================================================

const Application = require('../models/Application');
const { deleteFile } = require('../middleware/uploadMiddleware');

// ============================================================
// @desc    Submit a new internship application
// @route   POST /api/applications
// @access  Private (applicant)
// ============================================================
const createApplication = async (req, res, next) => {
  try {
    const { phone, university, department, cgpa, position, skills, coverLetter } = req.body;

    // Resume is required — check if multer uploaded it
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Resume (PDF) is required. Please upload your resume.',
      });
    }

    // Check: applicant can only apply once per position
    const existing = await Application.findOne({
      applicant: req.user._id,
      position,
    });

    if (existing) {
      // Delete the uploaded resume since we're rejecting
      deleteFile(`uploads/resumes/${req.file.filename}`);
      return res.status(409).json({
        success: false,
        message: `You have already applied for the ${position} position.`,
      });
    }

    // Parse skills — can come as JSON string or array
    let parsedSkills = [];
    if (skills) {
      parsedSkills = typeof skills === 'string' ? JSON.parse(skills) : skills;
    }

    const application = await Application.create({
      applicant: req.user._id,
      phone,
      university,
      department,
      cgpa: parseFloat(cgpa),
      position,
      skills: parsedSkills,
      coverLetter,
      resume: `uploads/resumes/${req.file.filename}`,
      status: 'pending',
    });

    // Populate applicant info for response
    await application.populate('applicant', 'fullName email username profilePicture');

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully! We will review it shortly.',
      application,
    });
  } catch (error) {
    // Clean up uploaded file if application creation failed
    if (req.file) {
      deleteFile(`uploads/resumes/${req.file.filename}`);
    }
    next(error);
  }
};

// ============================================================
// @desc    Get all applications for the logged-in applicant
// @route   GET /api/applications/my
// @access  Private (applicant)
// ============================================================
const getMyApplications = async (req, res, next) => {
  try {
    const { status, sort = 'newest', page = 1, limit = 10 } = req.query;

    // ── Build filter ──────────────────────────────────────────
    const filter = { applicant: req.user._id };
    if (status && ['pending', 'reviewed', 'accepted', 'rejected'].includes(status)) {
      filter.status = status;
    }

    // ── Build sort ────────────────────────────────────────────
    const sortOptions = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
    };
    const sortBy = sortOptions[sort] || { createdAt: -1 };

    // ── Pagination ────────────────────────────────────────────
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [applications, total] = await Promise.all([
      Application.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limitNum)
        .populate('applicant', 'fullName email username profilePicture'),
      Application.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: applications.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// @desc    Get a single application by ID (owner only)
// @route   GET /api/applications/:id
// @access  Private (applicant — own application only)
// ============================================================
const getApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id).populate(
      'applicant',
      'fullName email username phone profilePicture'
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found.',
      });
    }

    // Ensure the logged-in user owns this application
    if (application.applicant._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own applications.',
      });
    }

    res.status(200).json({
      success: true,
      application,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// @desc    Update own application (only if still pending)
// @route   PUT /api/applications/:id
// @access  Private (applicant — own application, pending only)
// ============================================================
const updateApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found.',
      });
    }

    // Ownership check
    if (application.applicant.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only update your own applications.',
      });
    }

    // Only allow edits while application is still pending
    if (application.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot edit an application that is already ${application.status}.`,
      });
    }

    const { phone, university, department, cgpa, skills, coverLetter } = req.body;

    // Update only provided fields
    if (phone) application.phone = phone;
    if (university) application.university = university;
    if (department) application.department = department;
    if (cgpa) application.cgpa = parseFloat(cgpa);
    if (coverLetter) application.coverLetter = coverLetter;
    if (skills) {
      application.skills = typeof skills === 'string' ? JSON.parse(skills) : skills;
    }

    // Handle resume replacement
    if (req.file) {
      deleteFile(application.resume); // Remove old resume
      application.resume = `uploads/resumes/${req.file.filename}`;
    }

    await application.save();
    await application.populate('applicant', 'fullName email username profilePicture');

    res.status(200).json({
      success: true,
      message: 'Application updated successfully.',
      application,
    });
  } catch (error) {
    if (req.file) deleteFile(`uploads/resumes/${req.file.filename}`);
    next(error);
  }
};

// ============================================================
// @desc    Delete own application (only if pending)
// @route   DELETE /api/applications/:id
// @access  Private (applicant — own, pending only)
// ============================================================
const deleteApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found.',
      });
    }

    // Ownership check
    if (application.applicant.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only delete your own applications.',
      });
    }

    // Only allow deletion if pending
    if (application.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot delete an application that is already ${application.status}.`,
      });
    }

    // Delete resume file from disk
    if (application.resume) {
      deleteFile(application.resume);
    }

    await Application.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Application deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createApplication,
  getMyApplications,
  getApplication,
  updateApplication,
  deleteApplication,
};
