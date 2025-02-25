/**
 * Authentication Middleware
 * @module middleware/auth
 * @description Handles request authentication and authorization
 */

const AuthService = require('../services/auth.service.js');
const User = require('../../models/user.model.js');
const ApiError = require('../utils/apiError.js');
const catchAsync = require('../utils/catchAsync.js');

/**
 * Middleware class for authentication and authorization
 * @class AuthMiddleware
 */
class AuthMiddleware {
  /**
   * Authenticates a user based on JWT token in Authorization header
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   * @returns {void}
   * @throws {ApiError} If token is missing, invalid, or user does not exist
   */
  static authenticate = catchAsync(async (req, res, next) => {
    // Check for token in header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(ApiError.unauthorized('Please provide a valid token'));
    }

    // Extract token
    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = AuthService.verifyToken(token);

    // Find user
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return next(ApiError.unauthorized('User no longer exists'));
    }

    // Attach user to request
    req.user = user;
    next();
  });

  /**
   * Creates a middleware to authorize users based on roles
   * @static
   * @param {...string} roles - Roles that are allowed to access the route
   * @returns {Function} Express middleware function
   * @throws {ApiError} If user's role is not included in the allowed roles
   */
  static authorize(...roles) {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return next(ApiError.forbidden('You are not authorized to perform this action'));
      }
      next();
    };
  }
}

module.exports = AuthMiddleware;