// ============================================================
// utils/seedAdmin.js — One-time Admin Seeder
// Run: node utils/seedAdmin.js
// Creates the default admin account in MongoDB Atlas.
// ============================================================

const dotenv = require('dotenv');
const path = require('path');

// Load .env from the server root
dotenv.config({ path: path.join(__dirname, '../.env') });

const mongoose = require('mongoose');
const User = require('../models/User');

const seedAdmin = async () => {
  try {
    console.log('⏳ Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas\n');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log(`ℹ️  Admin already exists: ${existingAdmin.email}`);
      console.log('   No new admin was created.');
      await mongoose.disconnect();
      process.exit(0);
    }

    // Create the admin user
    const admin = await User.create({
      username: 'admin',
      fullName: 'System Administrator',
      email: 'admin@internship.com',
      password: 'Admin@123456',    // Will be hashed by pre-save hook
      phone: '+1234567890',
      role: 'admin',
    });

    console.log('🎉 Admin user created successfully!');
    console.log('─────────────────────────────────────');
    console.log(`   Email    : ${admin.email}`);
    console.log(`   Password : Admin@123456`);
    console.log(`   Role     : ${admin.role}`);
    console.log('─────────────────────────────────────');
    console.log('⚠️  IMPORTANT: Change the password after first login!\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeder error:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedAdmin();
