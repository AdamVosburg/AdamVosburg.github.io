console.log('Starting to load user.model.js');

console.log('About to require mongoose');
const mongoose = require('mongoose');
console.log('Mongoose loaded successfully');

console.log('About to require bcryptjs');
const bcrypt = require('bcryptjs');
console.log('bcryptjs loaded successfully');

console.log('Defining userSchema');
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
console.log('userSchema defined');

console.log('Setting up password hashing middleware');
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
console.log('Password hashing middleware set up');

console.log('Defining schema methods');
userSchema.methods.isValidPassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.getFullName = function() {
  return `${this.firstName} ${this.lastName}`;
};
console.log('Schema methods defined');

console.log('Creating User model');
const User = mongoose.model('User', userSchema);
console.log('User model created');

console.log('About to export User model');
module.exports = User;
console.log('User model exported');