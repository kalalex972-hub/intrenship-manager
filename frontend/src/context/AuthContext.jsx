// ============================================================
// context/AuthContext.jsx — Global Authentication State
// Provides: user, token, isAuthenticated, isAdmin, loading
// Actions: login(), logout(), updateUser()
// Persists token in localStorage and rehydrates on page refresh
// ============================================================

import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import authService from '../services/authService';

// ─── Context Creation ─────────────────────────────────────────
const AuthContext = createContext(null);

// ─── Initial State ────────────────────────────────────────────
const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: false,
  loading: true, // true on mount while we verify the stored token
  error: null,
};

// ─── Reducer ──────────────────────────────────────────────────
const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_LOADING':
      return { ...state, loading: true, error: null };

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null,
      };

    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };

    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
        loading: false,
      };

    case 'AUTH_ERROR':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      };

    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    default:
      return state;
  }
};

// ─── Provider Component ───────────────────────────────────────
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // ── On mount: verify stored token by fetching profile ────────
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      try {
        dispatch({ type: 'AUTH_LOADING' });
        const data = await authService.getProfile();

        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user: data.user, token },
        });
      } catch (error) {
        // Token is invalid or expired — clear everything
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch({ type: 'AUTH_ERROR', payload: null });
      }
    };

    verifyToken();
  }, []);

  // ── Login ─────────────────────────────────────────────────────
  const login = useCallback(async (credentials) => {
    dispatch({ type: 'AUTH_LOADING' });
    try {
      const data = await authService.login(credentials);

      // Persist token to localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user: data.user, token: data.token },
      });

      return { success: true, user: data.user };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      dispatch({ type: 'AUTH_ERROR', payload: message });
      return { success: false, message };
    }
  }, []);

  // ── Logout ────────────────────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  }, []);

  // ── Update user in context (after profile edit) ───────────────
  const updateUser = useCallback((updatedFields) => {
    dispatch({ type: 'UPDATE_USER', payload: updatedFields });
    // Also update localStorage cache
    const current = JSON.parse(localStorage.getItem('user') || '{}');
    localStorage.setItem('user', JSON.stringify({ ...current, ...updatedFields }));
  }, []);

  // ── Derived state ─────────────────────────────────────────────
  const isAdmin = state.user?.role === 'admin';
  const isApplicant = state.user?.role === 'applicant';

  const value = {
    // State
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    isAdmin,
    isApplicant,
    loading: state.loading,
    error: state.error,
    // Actions
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ─── Custom Hook ──────────────────────────────────────────────
// Usage: const { user, login, logout } = useAuth();
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
