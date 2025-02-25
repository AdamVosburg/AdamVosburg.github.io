/**
 * API Error Utility
 * @module utils/apiError
 * @description Custom error class for API errors with status codes
 */

/**
 * Custom API Error class
 * @class ApiError
 * @extends Error
 */
class ApiError extends Error {
  /**
   * Create an API error
   * @constructor
   * @param {number} statusCode - HTTP status code
   * @param {string} [message='Something went wrong'] - Error message
   * @param {boolean} [isOperational=true] - Whether error is operational
   * @param {string} [stack=''] - Error stack trace
   */
  constructor(
    statusCode,
    message = 'Something went wrong',
    isOperational = true,
    stack = ''
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Create a Bad Request (400) error
   * @static
   * @param {string} [msg='Bad Request'] - Error message
   * @returns {ApiError} API error with 400 status code
   */
  static badRequest(msg = 'Bad Request') {
    return new ApiError(400, msg);
  }

  /**
   * Create an Unauthorized (401) error
   * @static
   * @param {string} [msg='Unauthorized'] - Error message
   * @returns {ApiError} API error with 401 status code
   */
  static unauthorized(msg = 'Unauthorized') {
    return new ApiError(401, msg);
  }

  /**
   * Create a Forbidden (403) error
   * @static
   * @param {string} [msg='Forbidden'] - Error message
   * @returns {ApiError} API error with 403 status code
   */
  static forbidden(msg = 'Forbidden') {
    return new ApiError(403, msg);
  }

  /**
   * Create a Not Found (404) error
   * @static
   * @param {string} [msg='Not Found'] - Error message
   * @returns {ApiError} API error with 404 status code
   */
  static notFound(msg = 'Not Found') {
    return new ApiError(404, msg);
  }

  /**
   * Create an Internal Server Error (500) error
   * @static
   * @param {string} [msg='Internal Server Error'] - Error message
   * @returns {ApiError} API error with 500 status code
   */
  static internalServer(msg = 'Internal Server Error') {
    return new ApiError(500, msg);
  }
}

module.exports = ApiError;