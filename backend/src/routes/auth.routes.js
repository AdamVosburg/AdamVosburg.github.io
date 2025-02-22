const express = require('express');
const AuthController = require('../controllers/auth.controller');
const AuthMiddleware = require('../middleware/auth.middleware');
const ValidationMiddleware = require('../middleware/validationMiddleware');
const Joi = require('joi');

const router = express.Router();

// Registration validation schema
const registrationSchema = Joi.object({
  username: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  role: Joi.string().valid('admin', 'trainer', 'veterinarian', 'staff')
});

// Login validation schema
const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});

// Registration route with validation
router.post('/register', 
  ValidationMiddleware.validate(registrationSchema),
  AuthController.register
);

// Login route with validation
router.post('/login', 
  ValidationMiddleware.validate(loginSchema),
  AuthController.login
);

// Get current user profile (protected route)
router.get('/me', 
  AuthMiddleware.authenticate,
  AuthController.getCurrentUser
);

module.exports = router;