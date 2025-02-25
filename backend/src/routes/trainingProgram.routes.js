/**
 * Training Program Routes
 * @module routes/trainingProgram
 * @description API routes for training program and session management
 */

const express = require('express');
const Joi = require('joi');
const TrainingProgramController = require('../controllers/trainingProgram.controller.js');
const AuthMiddleware = require('../middleware/auth.middleware.js');
const ValidationMiddleware = require('../middleware/validationMiddleware.js');

const router = express.Router();

/**
 * Training program schema
 * @type {Joi.ObjectSchema}
 */
const trainingProgramSchema = Joi.object({
  animalId: Joi.string().required(),
  type: Joi.string().required(),
  estimatedEndDate: Joi.date().required(),
  trainer: Joi.string().required()
});

/**
 * Progress report schema
 * @type {Joi.ObjectSchema}
 */
const progressReportSchema = Joi.object({
  report: Joi.string().required(),
  completionPercentage: Joi.number().min(0).max(100).required()
});

/**
 * Milestone schema
 * @type {Joi.ObjectSchema}
 */
const milestoneSchema = Joi.object({
  description: Joi.string().required(),
  targetDate: Joi.date().required()
});

/**
 * Training session schema
 * @type {Joi.ObjectSchema}
 */
const trainingSessionSchema = Joi.object({
  programId: Joi.string().required(),
  duration: Joi.number().integer().min(1).required(),
  trainer: Joi.string().required(),
  objectives: Joi.array().items(Joi.string())
});

/**
 * Create a new training program
 * @name POST /
 * @function
 * @memberof module:routes/trainingProgram
 * @param {Object} req.body - Training program data
 * @returns {Object} Created training program
 */
router.post('/', 
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize('trainer', 'admin'),
  ValidationMiddleware.validate(trainingProgramSchema),
  TrainingProgramController.createTrainingProgram
);

/**
 * Get training program by ID
 * @name GET /:id
 * @function
 * @memberof module:routes/trainingProgram
 * @param {string} id - Training program ID
 * @returns {Object} Training program data
 */
router.get('/:id', 
  AuthMiddleware.authenticate,
  TrainingProgramController.getTrainingProgramById
);

/**
 * Add progress report to training program
 * @name POST /:programId/progress
 * @function
 * @memberof module:routes/trainingProgram
 * @param {string} programId - Training program ID
 * @param {Object} req.body - Progress report data
 * @returns {Object} Updated training program
 */
router.post('/:programId/progress', 
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize('trainer', 'admin'),
  ValidationMiddleware.validate(progressReportSchema),
  TrainingProgramController.addProgressReport
);

/**
 * Add milestone to training program
 * @name POST /:programId/milestone
 * @function
 * @memberof module:routes/trainingProgram
 * @param {string} programId - Training program ID
 * @param {Object} req.body - Milestone data
 * @returns {Object} Updated training program
 */
router.post('/:programId/milestone', 
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize('trainer', 'admin'),
  ValidationMiddleware.validate(milestoneSchema),
  TrainingProgramController.addMilestone
);

/**
 * Complete training program
 * @name PATCH /:programId/complete
 * @function
 * @memberof module:routes/trainingProgram
 * @param {string} programId - Training program ID
 * @returns {Object} Completed training program
 */
router.patch('/:programId/complete', 
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize('trainer', 'admin'),
  TrainingProgramController.completeTrainingProgram
);

/**
 * Create a training session
 * @name POST /sessions
 * @function
 * @memberof module:routes/trainingProgram
 * @param {Object} req.body - Training session data
 * @returns {Object} Created training session
 */
router.post('/sessions', 
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize('trainer', 'admin'),
  ValidationMiddleware.validate(trainingSessionSchema),
  TrainingProgramController.createTrainingSession
);

/**
 * Get training sessions for a program
 * @name GET /:programId/sessions
 * @function
 * @memberof module:routes/trainingProgram
 * @param {string} programId - Training program ID
 * @returns {Array} Training sessions
 */
router.get('/:programId/sessions', 
  AuthMiddleware.authenticate,
  TrainingProgramController.getTrainingSessionsByProgram
);

/**
 * Generate program progress report
 * @name GET /:programId/report
 * @function
 * @memberof module:routes/trainingProgram
 * @param {string} programId - Training program ID
 * @returns {Object} Program progress report
 */
router.get('/:programId/report', 
  AuthMiddleware.authenticate,
  TrainingProgramController.generateProgramProgressReport
);

module.exports = router;