// ============================================================
// services/applicationService.js — Application API Calls
// Wraps all /api/applications endpoints
// ============================================================

import api from './api';

const applicationService = {
  /**
   * Submit a new internship application
   * Sends as multipart/form-data because of resume PDF upload
   * @param {FormData} formData - includes all fields + resume file
   */
  create: async (formData) => {
    const response = await api.post('/applications', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  /**
   * Get all applications submitted by the logged-in applicant
   * @param {Object} params - { status, sort, page, limit }
   */
  getMyApplications: async (params = {}) => {
    const response = await api.get('/applications/my', { params });
    return response.data;
  },

  /**
   * Get a single application by ID (owner only)
   * @param {string} id - Application MongoDB ObjectId
   */
  getById: async (id) => {
    const response = await api.get(`/applications/${id}`);
    return response.data;
  },

  /**
   * Update a pending application
   * Sends as multipart/form-data to support optional resume replacement
   * @param {string} id - Application ID
   * @param {FormData} formData - updated fields + optional new resume
   */
  update: async (id, formData) => {
    const response = await api.put(`/applications/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  /**
   * Delete a pending application
   * @param {string} id - Application ID
   */
  delete: async (id) => {
    const response = await api.delete(`/applications/${id}`);
    return response.data;
  },
};

export default applicationService;
