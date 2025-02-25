/**
 * Async Error Handler
 * @module utils/catchAsync
 * @description Utility for handling async errors in Express route handlers
 */

/**
 * Wraps async function to catch any errors and pass them to Express error handler
 * @function catchAsync
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Express middleware function that handles errors
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = catchAsync;