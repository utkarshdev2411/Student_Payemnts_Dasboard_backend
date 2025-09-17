const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Mongoose 6+ doesn't need these options, but keeping for compatibility
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });

    console.log(`[INFO] MongoDB Connected: ${conn.connection.host}`);
    console.log(`[INFO] Database Name: ${conn.connection.name}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('[ERROR] MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[WARN] MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('[INFO] MongoDB connection closed through app termination');
        process.exit(0);
      } catch (err) {
        console.error('[ERROR] Error during graceful shutdown:', err);
        process.exit(1);
      }
    });

    return conn;
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;