// ============================================================
// services/api.js — Axios Base Instance
// All API calls go through this instance.
// Automatically attaches JWT token and handles 401 globally.
// ============================================================

import axios from 'axios';

// Base URL from .env — falls back to Vite proxy path
const BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Create a configured Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // 15 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request Interceptor ──────────────────────────────────────
// Runs before every request — attaches the JWT token if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor ─────────────────────────────────────
// Runs after every response — handles global errors
api.interceptors.response.use(
  (response) => response, // Pass successful responses straight through

  (error) => {
    const { response } = error;

    // ── 401 Unauthorized: Token expired or invalid ────────────
    // Clear storage and redirect to login
    if (response?.status === 401) {
      const message = response?.data?.message || '';
      // Only auto-logout on token errors, not wrong password attempts
      if (
        message.includes('expired') ||
        message.includes('invalid token') ||
        message.includes('no token') ||
        message.includes('No token')
      ) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Redirect to login page (without React Router since we're outside components)
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }

    // ── Network error (no response received) ──────────────────
    if (!response) {
      error.message = 'Network error. Please check your connection.';
    }

    return Promise.reject(error);
  }
);

export default api;
