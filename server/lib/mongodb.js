/**
 * Serverless-Ready MongoDB Connection Manager (Mongoose)
 * Optimized for Vercel Serverless Functions and long-running Node/Express servers.
 */

const mongoose = require('mongoose');
const config = require('../config/keys');

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null, isMock: false };
}

async function connectToDatabase() {
  const uri = config.MONGODB_URI || process.env.MONGODB_URI;

  if (!uri) {
    // If no URI is provided, mark as mock/in-memory mode to prevent app crashes
    if (!cached.isMock) {
      console.warn('[MongoDB] No MONGODB_URI detected. Running in graceful in-memory storage mode.');
      cached.isMock = true;
    }
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    };

    cached.promise = mongoose.connect(uri, opts).then((mongooseInstance) => {
      console.log('[MongoDB] Connected successfully to database');
      cached.isMock = false;
      return mongooseInstance;
    }).catch((err) => {
      console.warn('[MongoDB] Connection failed, falling back to local store:', err.message);
      cached.isMock = true;
      cached.promise = null;
      return null;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    cached.conn = null;
    cached.isMock = true;
  }

  return cached.conn;
}

function getDatabaseStatus() {
  if (cached && cached.conn && mongoose.connection.readyState === 1) {
    return {
      connected: true,
      state: 'CONNECTED',
      database: mongoose.connection.name || 'gramsaksham',
      host: mongoose.connection.host || 'remote',
      mode: 'MONGODB_ATLAS'
    };
  }
  return {
    connected: false,
    state: cached?.isMock ? 'IN_MEMORY_FALLBACK' : 'DISCONNECTED',
    database: 'local_in_memory',
    mode: 'IN_MEMORY_STORE',
    tip: 'Provide MONGODB_URI in server/.env or Vercel Environment Variables to connect to live MongoDB Atlas'
  };
}

module.exports = {
  connectToDatabase,
  getDatabaseStatus
};
