import mongoose from 'mongoose';

let isConnected = false;
let memoryServer = null;

export async function connectDB() {
  let uri = process.env.MONGODB_URI;

  if (!uri || uri.includes('<password>')) {
    console.log('ℹ️  No valid MONGODB_URI found in environment.');
    console.log('🔄  Attempting to initialize local in-memory MongoDB instance for development...');
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      memoryServer = await MongoMemoryServer.create();
      uri = memoryServer.getUri();
      console.log('✨  In-Memory MongoDB server running successfully!');
    } catch (err) {
      console.warn('⚠️  Could not launch mongodb-memory-server:', err.message);
      console.warn('👉  Please set MONGODB_URI in backend/.env to your MongoDB Atlas connection string.');
      return false;
    }
  }

  try {
    await mongoose.connect(uri);
    isConnected = true;
    console.log(`✅  MongoDB connected: ${mongoose.connection.host}`);

    // If using in-memory server, auto-seed the database
    if (memoryServer) {
      console.log('🌱  Auto-seeding initial database records for demo...');
      try {
        const { User } = await import('../models/User.js');
        const userCount = await User.countDocuments();
        if (userCount === 0) {
          // Import seed function or populate
          const { seedInitialData } = await import('../utils/seedData.js');
          await seedInitialData();
          console.log('🎉  Initial seed data populated into in-memory database!');
        }
      } catch (seedErr) {
        console.warn('Seeding note:', seedErr.message);
      }
    }

    return true;
  } catch (err) {
    console.error('❌  MongoDB connection failed:', err.message);
    return false;
  }
}

export async function disconnectDB() {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
    console.log('MongoDB disconnected gracefully');
  }
  if (memoryServer) {
    await memoryServer.stop();
  }
}

export function getConnectionStatus() {
  return isConnected;
}
