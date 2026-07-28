// ============================================================
// controllers/adminController.js — Admin Business Logic
// getDashboard, getAllApplications, updateApplicationStatus,
// deleteApplication, getApplicantProfile, getAllUsers
// ============================================================

const Application = require('../models/Application');
const User = require('../models/User');

// ============================================================
// @desc    Get admin dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private (admin only)
// ============================================================
const getDashboard = async (req, res, next) => {
  try {
    // Run all aggregation queries in parallel for performance
    const [
      statusCounts,
      monthlyStats,
      topUniversities,
      topPositions,
      recentApplications,
      totalUsers,
    ] = await Promise.all([
      Application.getStatusCounts(),
      Application.getMonthlyStats(),
      Application.getTopUniversities(5),
      Application.getTopPositions(5),
      Application.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('applicant', 'fullName email username profilePicture'),
      User.countDocuments({ role: 'applicant' }),
    ]);

    // ── Format monthly stats for Chart.js ─────────────────────
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const formattedMonthly = monthlyStats.map((item) => ({
      label: `${monthNames[item._id.month - 1]} ${item._id.year}`,
      count: item.count,
      month: item._id.month,
      year: item._id.year,
    }));

    res.status(200).json({
      success: true,
      dashboard: {
        stats: {
          ...statusCounts,
          totalUsers,
        },
        monthlyApplications: formattedMonthly,
        topUniversities,
        topPositions,
        recentApplications,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// @desc    Get all applications with search, filter, sort, pagination
// @route   GET /api/admin/applications
// @access  Private (admin only)
// ============================================================
const getAllApplications = async (req, res, next) => {
  try {
    const {
      search = '',
      status,
      university,
      position,
      dateFrom,
      dateTo,
      sort = 'newest',
      page = 1,
      limit = 10,
    } = req.query;

    // ── Build filter object ───────────────────────────────────
    const filter = {};

    // Status filter
    if (status && ['pending', 'reviewed', 'accepted', 'rejected'].includes(status)) {
      filter.status = status;
    }

    // University filter (case-insensitive)
    if (university) {
      filter.university = { $regex: university, $options: 'i' };
    }

    // Position filter
    if (position) {
      filter.position = position;
    }

    // Date range filter
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) {
        const endDate = new Date(dateTo);
        endDate.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = endDate;
      }
    }

    // ── Sort options ──────────────────────────────────────────
    const sortOptions = {
      newest:  { createdAt: -1 },
      oldest:  { createdAt: 1 },
      cgpa:    { cgpa: -1 },
    };
    const sortBy = sortOptions[sort] || { createdAt: -1 };

    // ── Pagination ────────────────────────────────────────────
    const pageNum  = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip     = (pageNum - 1) * limitNum;

    // ── Handle search (requires populating applicant first) ───
    // Strategy: if search term provided, search in applicant name/email
    // AND in application fields university/position
    let applications;
    let total;

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');

      // Find matching users first
      const matchingUsers = await User.find({
        $or: [
          { fullName: searchRegex },
          { email: searchRegex },
          { username: searchRegex },
        ],
      }).select('_id');

      const userIds = matchingUsers.map((u) => u._id);

      // Combine user search with field search
      const searchFilter = {
        ...filter,
        $or: [
          { applicant: { $in: userIds } },
          { university: searchRegex },
          { position: searchRegex },
          { department: searchRegex },
        ],
      };

      [applications, total] = await Promise.all([
        Application.find(searchFilter)
          .sort(sortBy)
          .skip(skip)
          .limit(limitNum)
          .populate('applicant', 'fullName email username profilePicture phone'),
        Application.countDocuments(searchFilter),
      ]);
    } else {
      // No search — use filter only
      [applications, total] = await Promise.all([
        Application.find(filter)
          .sort(sortBy)
          .skip(skip)
          .limit(limitNum)
          .populate('applicant', 'fullName email username profilePicture phone'),
        Application.countDocuments(filter),
      ]);
    }

    // ── Sort by name (post-populate) ──────────────────────────
    if (sort === 'name') {
      applications.sort((a, b) =>
        (a.applicant?.fullName || '').localeCompare(b.applicant?.fullName || '')
      );
    }

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
// @desc    Get a single application by ID (admin view)
// @route   GET /api/admin/applications/:id
// @access  Private (admin only)
// ============================================================
const getApplicationById = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id).populate(
      'applicant',
      'fullName email username phone profilePicture createdAt'
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found.',
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
// @desc    Update application status and/or admin notes
// @route   PUT /api/admin/applications/:id
// @access  Private (admin only)
// ============================================================
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body;

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found.',
      });
    }

    // Update fields
    if (status) application.status = status;
    if (adminNotes !== undefined) application.adminNotes = adminNotes;

    await application.save();
    await application.populate('applicant', 'fullName email username profilePicture');

    res.status(200).json({
      success: true,
      message: `Application status updated to "${status}".`,
      application,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// @desc    Delete any application (admin)
// @route   DELETE /api/admin/applications/:id
// @access  Private (admin only)
// ============================================================
const deleteApplication = async (req, res, next) => {
  try {
    const { deleteFile } = require('../middleware/uploadMiddleware');

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found.',
      });
    }

    // Remove resume file from disk
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

// ============================================================
// @desc    Get all registered users (applicants)
// @route   GET /api/admin/users
// @access  Private (admin only)
// ============================================================
const getAllUsers = async (req, res, next) => {
  try {
    const { search = '', page = 1, limit = 10 } = req.query;

    const pageNum  = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip     = (pageNum - 1) * limitNum;

    const filter = { role: 'applicant' };

    if (search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { fullName: searchRegex },
        { email: searchRegex },
        { username: searchRegex },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      User.countDocuments(filter),
    ]);

    // Get application count per user efficiently
    const userIds = users.map((u) => u._id);
    const appCounts = await Application.aggregate([
      { $match: { applicant: { $in: userIds } } },
      { $group: { _id: '$applicant', count: { $sum: 1 } } },
    ]);

    const countMap = {};
    appCounts.forEach((item) => { countMap[item._id.toString()] = item.count; });

    const usersWithCounts = users.map((u) => ({
      ...u.toJSON(),
      applicationCount: countMap[u._id.toString()] || 0,
    }));

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      users: usersWithCounts,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// @desc    Get a single applicant profile with their applications
// @route   GET /api/admin/users/:id
// @access  Private (admin only)
// ============================================================
const getApplicantProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Fetch all their applications
    const applications = await Application.find({ applicant: req.params.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      user,
      applications,
      applicationCount: applications.length,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// @desc    Get reports data (for Reports page)
// @route   GET /api/admin/reports
// @access  Private (admin only)
// ============================================================
const getReports = async (req, res, next) => {
  try {
    const [
      statusCounts,
      monthlyStats,
      topUniversities,
      topPositions,
      cgpaDistribution,
    ] = await Promise.all([
      Application.getStatusCounts(),
      Application.getMonthlyStats(),
      Application.getTopUniversities(10),
      Application.getTopPositions(10),
      // CGPA distribution buckets
      Application.aggregate([
        {
          $bucket: {
            groupBy: '$cgpa',
            boundaries: [0, 1, 2, 3, 3.5, 4.01],
            default: 'Other',
            output: { count: { $sum: 1 } },
          },
        },
      ]),
    ]);

    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const formattedMonthly = monthlyStats.map((item) => ({
      label: `${monthNames[item._id.month - 1]} ${item._id.year}`,
      count: item.count,
    }));

    res.status(200).json({
      success: true,
      reports: {
        statusCounts,
        monthlyApplications: formattedMonthly,
        topUniversities,
        topPositions,
        cgpaDistribution,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboard,
  getAllApplications,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication,
  getAllUsers,
  getApplicantProfile,
  getReports,
};
