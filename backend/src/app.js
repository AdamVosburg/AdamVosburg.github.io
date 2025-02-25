/**
 * Main Application Module
 * @module app
 * @description Express application setup and configuration
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const logger = require('./config/logger');
const connectDB = require('./config/database');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const ApiError = require('./utils/apiError');

// Load environment variables
dotenv.config();

/**
 * Initialize Express application
 * @type {express.Application}
 */
const app = express();

/**
 * Connect to MongoDB database
 */
connectDB();

/**
 * Configure middleware
 */

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware - logs all incoming requests
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

/**
 * Configure routes
 */

// API routes
app.use('/api/v1', routes);

// Basic health check route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Grazios Rescue System API',
    status: 'Operational'
  });
});

/**
 * Error handling configuration
 */

// 404 handler for undefined routes
app.use((req, res, next) => {
  next(ApiError.notFound(`Route ${req.originalUrl} not found`));
});

// Global error handler middleware
app.use(errorHandler);

/**
 * Start server
 */
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

/**
 * Handle unhandled exceptions and rejections
 */

// Unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

// Uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app;