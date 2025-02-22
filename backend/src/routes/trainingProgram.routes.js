const express = require('express');
const TrainingProgramController = require('../controllers/trainingProgram.controller');
const AuthMiddleware = require('../middleware/auth.middleware');
const ValidationMiddleware = require('../middleware/validationMiddleware');
const Joi = require('joi');

const router = express.Router();

// Training Program Creation Validation Schema
const trainingProgramSchema = Joi.object({
  animalId: Joi.string().required(),
  type: Joi.string().required(),
  trainer: Joi.string().required()
});

// Progress Report Validation Schema
const progressReportSchema = Joi.object({
  report: Joi.string().required(),
  completionPercentage: Joi.number().min(0).max(100).required()
});

// Milestone Validation Schema
const milestoneSchema = Joi.object({
  description: Joi.string().required(),
  targetDate: Joi.date().optional()
});

// Training Session Validation Schema
const trainingSessionSchema = Joi.object({
  programId: Joi.string().required(),
  trainer: Joi.string().required(),
  duration: Joi.number().required(),
  objectives: Joi.array().items(Joi.object({
    description: Joi.string().required()
  })).optional()
});

// Create a new training program (protected route)
router.post('/', 
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize('admin', 'trainer'),
  ValidationMiddleware.validate(trainingProgramSchema),
  TrainingProgramController.createTrainingProgram
);

// Get training program by ID (protected route)
router.get('/:id', 
  AuthMiddleware.authenticate,
  TrainingProgramController.getTrainingProgramById
);

// Add progress report to training program (protected route)
router.post('/:programId/progress-reports', 
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize('admin', 'trainer'),
  ValidationMiddleware.validate(progressReportSchema),
  TrainingProgramController.addProgressReport
);

// Add milestone to training program (protected route)
router.post('/:programId/milestones', 
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize('admin', 'trainer'),
  ValidationMiddleware.validate(milestoneSchema),
  TrainingProgramController.addMilestone
);

// Complete training program (protected route)
router.patch('/:programId/complete', 
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize('admin', 'trainer'),
  TrainingProgramController.completeTrainingProgram
);

// Create a training session (protected route)
router.post('/sessions', 
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize('admin', 'trainer'),
  ValidationMiddleware.validate(trainingSessionSchema),
  TrainingProgramController.createTrainingSession
);

// Get training sessions for a program (protected route)
router.get('/:programId/sessions', 
  AuthMiddleware.authenticate,
  TrainingProgramController.getTrainingSessionsByProgram
);

// Generate program progress report (protected route)
router.get('/:programId/progress-report', 
  AuthMiddleware.authenticate,
  TrainingProgramController.generateProgramProgressReport
);

module.exports = router;