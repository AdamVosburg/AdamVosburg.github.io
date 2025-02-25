/**
 * Authentication Routes
 * @module routes/auth
 * @description API routes for authentication and user management
 */

const express = require('express');
const Joi = require('joi');
const AuthController = require('../controllers/auth.controller.js');
const AuthMiddleware = require('../middleware/auth.middleware.js');
const ValidationMiddleware = require('../middleware/validationMiddleware.js');

const router = express.Router();

/**
 * User registration schema
 * @type {Joi.ObjectSchema}
 */
const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  role: Joi.string().valid('admin', 'trainer', 'veterinarian', 'staff').default('staff')
});

/**
 * Login schema
 * @type {Joi.ObjectSchema}
 */
const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});

/**
 * Register a new user
 * @name POST /register
 * @function
 * @memberof module:routes/auth
 * @param {Object} req.body - User registration data
 * @returns {Object} User data and authentication token
 */
router.post('/register', ValidationMiddleware.validate(registerSchema), AuthController.register);

/**
 * Login a user
 * @name POST /login
 * @function
 * @memberof module:routes/auth
 * @param {Object} req.body - User login credentials
 * @returns {Object} User data and authentication token
 */
router.post('/login', ValidationMiddleware.validate(loginSchema), AuthController.login);

/**
 * Get current user profile
 * @name GET /me
 * @function
 * @memberof module:routes/auth
 * @requires Authentication
 * @returns {Object} Current user data
 */
router.get('/me', AuthMiddleware.authenticate, AuthController.getCurrentUser);

/**
 * Admin-only route example
 * @name GET /admin
 * @function
 * @memberof module:routes/auth
 * @requires Authentication and Authorization
 * @returns {Object} Success message
 */
router.get('/admin', 
  AuthMiddleware.authenticate, 
  AuthMiddleware.authorize('admin'), 
  (req, res) => {
    res.status(200).json({ message: 'Admin access granted' });
  }
);

module.exports = router;