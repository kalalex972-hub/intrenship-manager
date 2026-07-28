// ============================================================
// services/adminService.js — Admin API Calls
// Wraps all /api/admin endpoints
// ============================================================

import api from './api';

const adminService = {
  /**
   * Get dashboard statistics
   * Returns: stats, monthlyApplications, topUniversities, topPositions, recentApplications
   */
  getDashboard: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  /**
   * Get all applications with search, filter, sort, and pagination
   * @param {Object} params - { search, status, university, position, dateFrom, dateTo, sort, page, limit }
   */
  getAllApplications: async (params = {}) => {
    const response = await api.get('/admin/applications', { params });
    return response.data;
  },

  /**
   * Get full details of a single application
   * @param {string} id - Application ID
   */
  getApplicationById: async (id) => {
    const response = await api.get(`/admin/applications/${id}`);
    return response.data;
  },

  /**
   * Update an application's status and/or admin notes
   * @param {string} id - Application ID
   * @param {Object} data - { status, adminNotes }
   */
  updateApplicationStatus: async (id, data) => {
    const response = await api.put(`/admin/applications/${id}`, data);
    return response.data;
  },

  /**
   * Delete an application permanently
   * @param {string} id - Application ID
   */
  deleteApplication: async (id) => {
    const response = await api.delete(`/admin/applications/${id}`);
    return response.data;
  },

  /**
   * Get all registered applicants with application counts
   * @param {Object} params - { search, page, limit }
   */
  getAllUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  /**
   * Get a specific applicant's profile and their applications
   * @param {string} id - User ID
   */
  getApplicantProfile: async (id) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  /**
   * Get detailed reports data
   * Returns: statusCounts, monthlyApplications, topUniversities, topPositions, cgpaDistribution
   */
  getReports: async () => {
    const response = await api.get('/admin/reports');
    return response.data;
  },
};

export default adminService;
