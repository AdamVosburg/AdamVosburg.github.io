const express = require('express');
const TrainerController = require('../controllers/trainer.controller');
const AuthMiddleware = require('../middleware/auth.middleware');
const ValidationMiddleware = require('../middleware/validationMiddleware');
const Joi = require('joi');

const router = express.Router();

// Trainer creation validation schema
const trainerCreationSchema = Joi.object({
  name: Joi.string().required(),
  specialties: Joi.array().items(Joi.string()),
  workloadCapacity: Joi.number().min(0).max(10),
  workHours: Joi.string(),
  contactInfo: Joi.string()
});

// Animal assignment validation schema
const animalAssignmentSchema = Joi.object({
  animalId: Joi.string().required()
});

// Specialty addition validation schema
const specialtySchema = Joi.object({
  specialty: Joi.string().required()
});

// Certification addition validation schema
const certificationSchema = Joi.object({
  type: Joi.string().required(),
  expiryDate: Joi.date().optional()
});

// Performance metrics validation schema
const performanceMetricsSchema = Joi.object({
  // Define specific performance metric validation
}).unknown(true);

// Work hours validation schema
const workHoursSchema = Joi.object({
  workHours: Joi.string().required()
});

// Create a new trainer (protected route)
router.post('/', 
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize('admin'),
  ValidationMiddleware.validate(trainerCreationSchema),
  TrainerController.createTrainer
);

// Get all trainers (protected route)
router.get('/', 
  AuthMiddleware.authenticate,
  TrainerController.getAllTrainers
);

// Get trainer by ID (protected route)
router.get('/:id', 
  AuthMiddleware.authenticate,
  TrainerController.getTrainerById
);

// Assign animal to trainer (protected route)
router.post('/:trainerId/assign-animal', 
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize('admin', 'trainer'),
  ValidationMiddleware.validate(animalAssignmentSchema),
  TrainerController.assignAnimal
);

// Add specialty to trainer (protected route)
router.post('/:trainerId/specialties', 
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize('admin', 'trainer'),
  ValidationMiddleware.validate(specialtySchema),
  TrainerController.addSpecialty
);

// Add certification to trainer (protected route)
router.post('/:trainerId/certifications', 
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize('admin', 'trainer'),
  ValidationMiddleware.validate(certificationSchema),
  TrainerController.addCertification
);

// Update performance metrics (protected route)
router.patch('/:trainerId/performance', 
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize('admin'),
  ValidationMiddleware.validate(performanceMetricsSchema),
  TrainerController.updatePerformanceMetrics
);

// Update work hours (protected route)
router.patch('/:trainerId/work-hours', 
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize('admin', 'trainer'),
  ValidationMiddleware.validate(workHoursSchema),
  TrainerController.updateWorkHours
);

// Deactivate trainer (protected route)
router.patch('/:trainerId/deactivate', 
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize('admin'),
  TrainerController.deactivateTrainer
);

module.exports = router;