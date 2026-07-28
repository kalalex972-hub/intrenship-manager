// ============================================================
// tailwind.config.js — Tailwind CSS Configuration
// Dark mode: class-based (toggled by adding 'dark' to <html>)
// Custom colors and extended theme for the app design
// ============================================================

/** @type {import('tailwindcss').Config} */
export default {
  // ── Content paths — Tailwind scans these for class names ──
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],

  // ── Dark mode: add/remove 'dark' class on <html> element ──
  darkMode: 'class',

  theme: {
    extend: {
      // ── Brand Colors ──────────────────────────────────────
      colors: {
        primary: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        // Status colors matching badge system
        status: {
          pending:  '#f59e0b', // amber
          reviewed: '#3b82f6', // blue
          accepted: '#10b981', // emerald
          rejected: '#ef4444', // red
        },
      },

      // ── Typography ────────────────────────────────────────
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },

      // ── Animations ────────────────────────────────────────
      animation: {
        'fade-in':     'fadeIn 0.3s ease-in-out',
        'slide-down':  'slideDown 0.3s ease-out',
        'slide-up':    'slideUp 0.3s ease-out',
        'spin-slow':   'spin 2s linear infinite',
        'pulse-slow':  'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideDown: {
          '0%':   { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },

      // ── Shadows ───────────────────────────────────────────
      boxShadow: {
        'card':   '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      },

      // ── Screen breakpoints ─────────────────────────────────
      screens: {
        'xs': '475px',
      },
    },
  },

  plugins: [],
};
