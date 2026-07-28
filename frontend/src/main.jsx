// ============================================================
// main.jsx — React Application Entry Point
// Wraps App with all context providers.
// Provider order matters: Theme first (affects DOM class),
// then Auth (verifies token), then Toast (UI notifications).
// ============================================================

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Context Providers
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider }  from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* ThemeProvider first — applies dark class to <html> immediately */}
    <ThemeProvider>
      {/* AuthProvider — verifies stored JWT token on mount */}
      <AuthProvider>
        {/* ToastProvider — global notification system */}
        <ToastProvider>
          <App />
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
