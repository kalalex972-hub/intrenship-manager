// ============================================================
// config/database.js — MongoDB Atlas Connection Configuration
// Uses Mongoose to connect to the cloud database.
// Includes retry logic, event listeners, and graceful shutdown.
// ============================================================

const mongoose = require('mongoose');

const PLACEHOLDER_PATTERN = /<username>|<password>|xxxxx/;

const mongooseOptions = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4,
};

let retryCount = 0;
const MAX_RETRIES = 5;
let mongod = null;

const connectDB = async () => {
  try {
    let mongoURI = process.env.MONGODB_URI;

    if (!mongoURI || PLACEHOLDER_PATTERN.test(mongoURI)) {
      console.log('⚠️  No valid MONGODB_URI found. Starting in-memory MongoDB...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongod = await MongoMemoryServer.create({
        instance: { startupTimeoutMS: 60000 },
      });
      mongoURI = mongod.getUri();
      console.log(`🧪 In-memory MongoDB started at ${mongoURI}`);
    }

    console.log('⏳ Connecting to MongoDB...');

    const conn = await mongoose.connect(mongoURI, mongooseOptions);

    retryCount = 0;

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📦 Database: ${conn.connection.name}`);

  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);

    if (retryCount < MAX_RETRIES) {
      retryCount++;
      const delay = Math.pow(2, retryCount) * 1000;
      console.log(`🔄 Retrying connection in ${delay / 1000}s... (Attempt ${retryCount}/${MAX_RETRIES})`);
      setTimeout(connectDB, delay);
    } else {
      console.error('💀 Max retry attempts reached. Exiting process.');
      process.exit(1);
    }
  }
};

// ─── Mongoose Connection Event Listeners ─────────────────────

// Fires when Mongoose loses connection to MongoDB
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
});

// Fires when Mongoose successfully reconnects
mongoose.connection.on('reconnected', () => {
  console.log('🔁 MongoDB reconnected successfully.');
});

// Fires on any connection error after the initial connect
mongoose.connection.on('error', (err) => {
  console.error(`❌ MongoDB runtime error: ${err.message}`);
});

// ─── Graceful Shutdown ────────────────────────────────────────
// Close the Mongoose connection cleanly when the Node process ends

// Handle SIGINT (Ctrl+C in terminal)
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('🛑 MongoDB connection closed due to app termination (SIGINT).');
    process.exit(0);
  } catch (err) {
    console.error('Error closing MongoDB connection:', err.message);
    process.exit(1);
  }
});

// Handle SIGTERM (sent by cloud platforms like Render/Railway on shutdown)
process.on('SIGTERM', async () => {
  try {
    await mongoose.connection.close();
    console.log('🛑 MongoDB connection closed due to SIGTERM.');
    process.exit(0);
  } catch (err) {
    console.error('Error closing MongoDB connection:', err.message);
    process.exit(1);
  }
});

module.exports = connectDB;
