const jwt = require('jsonwebtoken');
const User = require('../../models/user.model.js');
const ApiError = require('../utils/apiError.js');
const logger = require('../config/logger.js');

class AuthService {
  // Generate JWT token
  static generateToken(user) {
    return jwt.sign(
      { 
        id: user._id, 
        username: user.username, 
        role: user.role 
      }, 
      process.env.JWT_SECRET, 
      { 
        expiresIn: process.env.JWT_EXPIRES_IN || '1d' 
      }
    );
  }

  // User registration
  static async register(userData) {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [
          { username: userData.username },
          { email: userData.email }
        ]
      });

      if (existingUser) {
        throw ApiError.badRequest('Username or email already exists');
      }

      // Create new user
      const user = new User(userData);
      await user.save();

      // Generate token
      const token = this.generateToken(user);

      return {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        token
      };
    } catch (error) {
      logger.error(`Registration error: ${error.message}`);
      throw error;
    }
  }

  // User login
  static async login(username, password) {
    try {
      // Find user by username
      const user = await User.findOne({ username });

      // Check if user exists and password is correct
      if (!user || !(await user.isValidPassword(password))) {
        throw ApiError.unauthorized('Invalid username or password');
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate token
      const token = this.generateToken(user);

      return {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        token
      };
    } catch (error) {
      logger.error(`Login error: ${error.message}`);
      throw error;
    }
  }

  // Verify JWT token
  static verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw ApiError.unauthorized('Invalid or expired token');
    }
  }
}

module.exports = AuthService;