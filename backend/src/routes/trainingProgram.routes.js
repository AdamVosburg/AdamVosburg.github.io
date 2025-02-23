console.log('Starting to load trainingProgram.routes.js');

console.log('About to require express');
const express = require('express');
console.log('Express loaded successfully');

console.log('About to require TrainingProgramController');
let TrainingProgramController;
try {
  TrainingProgramController = require('../controllers/trainingProgram.controller');
  console.log('TrainingProgramController loaded successfully');
} catch (error) {
  console.error('Error loading TrainingProgramController:', error.message);
  console.error('Error stack:', error.stack);
}

console.log('About to require AuthMiddleware');
let AuthMiddleware;
try {
  AuthMiddleware = require('../middleware/auth.middleware');
  console.log('AuthMiddleware loaded successfully');
} catch (error) {
  console.error('Error loading AuthMiddleware:', error.message);
  console.error('Error stack:', error.stack);
}

console.log('About to require ValidationMiddleware');
let ValidationMiddleware;
try {
  ValidationMiddleware = require('../middleware/validationMiddleware');
  console.log('ValidationMiddleware loaded successfully');
} catch (error) {
  console.error('Error loading ValidationMiddleware:', error.message);
  console.error('Error stack:', error.stack);
}

console.log('About to require Joi');
const Joi = require('joi');
console.log('Joi loaded successfully');

const router = express.Router();
console.log('Express router created');

// ... (rest of the file remains the same)

console.log('About to export router from trainingProgram.routes.js');
module.exports = router;
console.log('Router exported from trainingProgram.routes.js');