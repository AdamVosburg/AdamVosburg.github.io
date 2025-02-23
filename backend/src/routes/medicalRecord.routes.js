console.log('Starting to load medicalRecord.routes.js');

console.log('About to require express');
const express = require('express');
console.log('Express loaded successfully');

console.log('About to require MedicalRecordController');
let MedicalRecordController;
try {
  MedicalRecordController = require('../controllers/medicalRecord.controller.js');
  console.log('MedicalRecordController loaded successfully');
} catch (error) {
  console.error('Error loading MedicalRecordController:', error.message);
  console.error('Error stack:', error.stack);
}

console.log('About to require AuthMiddleware');
let AuthMiddleware;
try {
  AuthMiddleware = require('../middleware/auth.middleware.js');
  console.log('AuthMiddleware loaded successfully');
} catch (error) {
  console.error('Error loading AuthMiddleware:', error.message);
  console.error('Error stack:', error.stack);
}

console.log('About to require ValidationMiddleware');
let ValidationMiddleware;
try {
  ValidationMiddleware = require('../middleware/validationMiddleware.js');
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

console.log('About to export router from medicalRecord.routes.js');
module.exports = router;
console.log('Router exported from medicalRecord.routes.js');