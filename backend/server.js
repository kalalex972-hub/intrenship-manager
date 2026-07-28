// ============================================================
// server.js — Main entry point for the Express application
// Loads env vars, connects DB, registers middleware & routes
// ============================================================

const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables FIRST before importing anything else
dotenv.config();

const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const errorHandler = require('./middleware/errorHandler');

// Initialize Express app
const app = express();

// ─── Connect to MongoDB Atlas ────────────────────────────────
connectDB();

// ─── Core Middleware ─────────────────────────────────────────

// CORS — allow requests from the React frontend
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true, // allow cookies / auth headers
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Parse incoming JSON bodies (max 10mb for base64 images if needed)
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Static File Serving ─────────────────────────────────────
// Serve uploaded resumes and profile pictures publicly
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Health Check Route ───────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Internship Manager API is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ───────────────────────────────────────────────
app.use('/api/auth', authRoutes);           // Register, Login, Profile
app.use('/api/applications', applicationRoutes); // Applicant applications
app.use('/api/admin', adminRoutes);         // Admin dashboard & management

// ─── 404 Handler (unknown routes) ────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// ─── Global Error Handler ─────────────────────────────────────
// Must be registered AFTER all routes
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`\n🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health\n`);
});

// ─── Graceful Shutdown ────────────────────────────────────────
// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  // Close server gracefully before exiting
  server.close(() => {
    process.exit(1);
  });
});

// Handle SIGTERM (e.g., from Render/Railway on deploy)
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('💤 Process terminated.');
  });
});

module.exports = app;
