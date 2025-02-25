/**
 * Authentication Controller
 * @module controllers/auth
 * @description Handles HTTP requests related to authentication and authorization
 */

const AuthService = require('../services/auth.service.js');
const catchAsync = require('../utils/catchAsync.js');

/**
 * Controller class for authentication operations
 * @class AuthController
 */
class AuthController {
  /**
   * Register a new user
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.body - Request body containing user registration data
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with registered user and token
   */
  static register = catchAsync(async (req, res) => {
    const userData = req.body;
    const result = await AuthService.register(userData);

    res.status(201).json({
      status: 'success',
      data: result
    });
  });

  /**
   * Login a user
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.body - Request body
   * @param {string} req.body.username - User's username
   * @param {string} req.body.password - User's password
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with user data and authentication token
   */
  static login = catchAsync(async (req, res) => {
    const { username, password } = req.body;
    const result = await AuthService.login(username, password);

    res.status(200).json({
      status: 'success',
      data: result
    });
  });

  /**
   * Get current user profile
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.user - User object added by authentication middleware
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with current user data
   */
  static getCurrentUser = catchAsync(async (req, res) => {
    // This assumes authentication middleware has added the user to the request
    res.status(200).json({
      status: 'success',
      data: req.user
    });
  });
}

module.exports = AuthController;