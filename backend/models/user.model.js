/**
 * User Model
 * @module models/user
 * @description Manages user accounts and authentication
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User schema definition
 * @type {mongoose.Schema}
 */
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['admin', 'trainer', 'veterinarian', 'staff'],
    default: 'staff'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

/**
 * Pre-save middleware to hash password before saving
 * Only hashes the password if it has been modified
 */
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Validates a password against the hashed password stored in the database
 * @param {String} candidatePassword - Password to validate
 * @returns {Promise<Boolean>} Whether the password is valid
 */
userSchema.methods.isValidPassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Gets the user's full name by combining first and last name
 * @returns {String} The user's full name
 */
userSchema.methods.getFullName = function() {
  return `${this.firstName} ${this.lastName}`;
};

/**
 * User model
 * @type {mongoose.Model}
 */
const User = mongoose.model('User', userSchema);

module.exports = User;