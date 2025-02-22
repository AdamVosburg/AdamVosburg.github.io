const AuthService = require('../services/auth.service');
const catchAsync = require('../utils/catchAsync');

class AuthController {
  // User registration
  static register = catchAsync(async (req, res) => {
    const userData = req.body;
    const result = await AuthService.register(userData);

    res.status(201).json({
      status: 'success',
      data: result
    });
  });

  // User login
  static login = catchAsync(async (req, res) => {
    const { username, password } = req.body;
    const result = await AuthService.login(username, password);

    res.status(200).json({
      status: 'success',
      data: result
    });
  });

  // Get current user profile
  static getCurrentUser = catchAsync(async (req, res) => {
    // This assumes authentication middleware has added the user to the request
    res.status(200).json({
      status: 'success',
      data: req.user
    });
  });
}

module.exports = AuthController;