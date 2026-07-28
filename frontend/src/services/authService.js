// ============================================================
// services/authService.js — Authentication API Calls
// Wraps all /api/auth endpoints with clean async functions
// ============================================================

import api from './api';

const authService = {
  /**
   * Register a new applicant account
   * @param {Object} data - { username, fullName, email, password, phone }
   */
  register: async (data) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  /**
   * Login with email and password
   * @param {Object} data - { email, password }
   * @returns { success, token, user }
   */
  login: async (data) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  /**
   * Get the currently authenticated user's profile
   * Requires valid JWT in Authorization header (handled by interceptor)
   */
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  /**
   * Update the current user's profile
   * Sends as multipart/form-data to support profile picture upload
   * @param {FormData} formData - may include profilePicture file
   */
  updateProfile: async (formData) => {
    const response = await api.put('/auth/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

export default authService;
