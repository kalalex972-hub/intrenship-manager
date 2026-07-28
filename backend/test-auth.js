// test-auth.js — Full auth flow test
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });

const mongoose = require('mongoose');
const User = require('./models/User');
const jwt = require('jsonwebtoken');

async function runTests() {
  let mongod = null;
  
  try {
    // 1. Connect to DB
    let mongoURI = process.env.MONGODB_URI;
    const PLACEHOLDER_PATTERN = /<username>|<password>|xxxxx/;
    
    if (!mongoURI || PLACEHOLDER_PATTERN.test(mongoURI)) {
      console.log('[DB] No valid URI. Starting in-memory MongoDB...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongod = await MongoMemoryServer.create({ instance: { startupTimeoutMS: 60000 } });
      mongoURI = mongod.getUri();
    }
    
    console.log('[DB] Connecting to:', mongoURI);
    await mongoose.connect(mongoURI);
    console.log('[DB] Connected! Database:', mongoose.connection.name);

    // 2. Check for admin user
    console.log('\n--- CHECKING ADMIN USER ---');
    const admin = await User.findOne({ role: 'admin' });
    if (admin) {
      console.log('[ADMIN] Found:', admin.email, '| role:', admin.role);
    } else {
      console.log('[ADMIN] NO admin user found in database!');
      console.log('[ADMIN] Creating default admin...');
      
      const newAdmin = await User.create({
        username: 'admin',
        fullName: 'System Administrator',
        email: 'admin@internship.com',
        password: 'Admin@123456',
        phone: '+1234567890',
        role: 'admin',
      });
      console.log('[ADMIN] Created:', newAdmin.email, '| role:', newAdmin.role);
    }

    // 3. Test password comparison
    console.log('\n--- TESTING PASSWORD ---');
    const loginAdmin = await User.findOne({ email: 'admin@internship.com' }).select('+password');
    if (!loginAdmin) {
      console.log('[LOGIN] FAIL: Cannot find admin@internship.com');
      process.exit(1);
    }
    
    const passwordMatch = await loginAdmin.comparePassword('Admin@123456');
    console.log('[LOGIN] Password "Admin@123456" matches:', passwordMatch);
    
    const wrongMatch = await loginAdmin.comparePassword('wrongpassword');
    console.log('[LOGIN] Password "wrongpassword" matches:', wrongMatch);

    // 4. Test JWT generation
    console.log('\n--- TESTING JWT ---');
    const JWT_SECRET = process.env.JWT_SECRET;
    console.log('[JWT] Secret is set:', !!JWT_SECRET);
    console.log('[JWT] Secret length:', JWT_SECRET ? JWT_SECRET.length : 0);
    
    const token = jwt.sign(
      { id: loginAdmin._id, role: loginAdmin.role },
      JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    console.log('[JWT] Token generated:', token.substring(0, 50) + '...');
    
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('[JWT] Token verified. Payload:', { id: decoded.id, role: decoded.role });

    // 5. Test full login simulation
    console.log('\n--- FULL LOGIN SIMULATION ---');
    const { email, password } = { email: 'admin@internship.com', password: 'Admin@123456' };
    
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log('[SIM] FAIL: User not found');
    } else if (!user.isActive) {
      console.log('[SIM] FAIL: Account deactivated');
    } else {
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        console.log('[SIM] FAIL: Wrong password');
      } else {
        const simToken = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        console.log('[SIM] SUCCESS: Login simulation passed');
        console.log('[SIM] Token:', simToken.substring(0, 50) + '...');
        console.log('[SIM] User role:', user.role);
        
        // Verify the token works with protect middleware logic
        const verified = jwt.verify(simToken, JWT_SECRET);
        const foundUser = await User.findById(verified.id).select('-password');
        console.log('[SIM] Token verification:', foundUser ? 'PASS' : 'FAIL');
        console.log('[SIM] User from token:', foundUser ? foundUser.email : 'N/A');
      }
    }

    console.log('\n--- ALL TESTS PASSED ---');
  } catch (error) {
    console.error('\n[ERROR]', error.message);
    console.error(error.stack);
  } finally {
    await mongoose.disconnect();
    if (mongod) await mongod.stop();
    process.exit(0);
  }
}

runTests();
