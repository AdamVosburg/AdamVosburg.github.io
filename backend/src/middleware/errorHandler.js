/**
 * Error Handler Middleware
 * @module middleware/errorHandler
 * @description Centralized error handling middleware for the application
 */

const logger = require('../config/logger.js');
const ApiError = require('../utils/apiError.js');

/**
 * Global error handler middleware
 * @function errorHandler
 * @param {Error|ApiError} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} JSON response with error details
 */
const errorHandler = (err, req, res, next) => {
  let error = err;

  // If not an ApiError, create a new ApiError with the original error
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, false, err.stack);
  }

  // Log the error
  logger.error(`${error.statusCode} - ${error.message}`);

  // Send response
  res.status(error.statusCode).json({
    status: 'error',
    statusCode: error.statusCode,
    message: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};

module.exports = errorHandler;