/**
 * Database Connection Utility
 * @module utils/database
 * @description Handles MongoDB connection and error handling
 */

const mongoose = require('mongoose');
const logger = require('./logger.js');

/**
 * Connects to MongoDB using environment variables
 * @async
 * @function connectDB
 * @returns {Promise<mongoose.Connection>} Mongoose connection object
 * @throws {Error} If connection fails, logs error and exits process
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    logger.error(`MongoDB Connection Error: ${error.message}`);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;