const AuthService = require('../services/auth.service.js');
const User = require('../../models/user.model.js');
const ApiError = require('../utils/apiError.js');
const catchAsync = require('../utils/catchAsync.js');

class AuthMiddleware {
  // Authenticate user
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

  // Role-based authorization
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