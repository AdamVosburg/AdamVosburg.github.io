/**
 * Trainer Routes
 * @module routes/trainer
 * @description API routes for trainer management
 */

const express = require('express');
const Joi = require('joi');
const TrainerController = require('../controllers/trainer.controller.js');
const AuthMiddleware = require('../middleware/auth.middleware.js');
const ValidationMiddleware = require('../middleware/validationMiddleware.js');

const router = express.Router();

/**
 * Trainer creation schema
 * @type {Joi.ObjectSchema}
 */
const trainerSchema = Joi.object({
  name: Joi.string().required(),
  specialties: Joi.array().items(Joi.string()),
  certifications: Joi.array().items(Joi.object({
    certType: Joi.string().required(),
    dateEarned: Joi.date(),
    expiryDate: Joi.date().min(Joi.ref('dateEarned'))
  })),
  workloadCapacity: Joi.number().integer().min(0).max(10).default(5),
  workHours: Joi.string(),
  contactInfo: Joi.string()
});

/**
 * Specialty schema
 * @type {Joi.ObjectSchema}
 */
const specialtySchema = Joi.object({
  specialty: Joi.string().required()
});

/**
 * Certification schema
 * @type {Joi.ObjectSchema}
 */
const certificationSchema = Joi.object({
  type: Joi.string().required(),
  expiryDate: Joi.date().required()
});

/**
 * Performance metrics schema
 * @type {Joi.ObjectSchema}
 */
const performanceMetricsSchema = Joi.object({
  successRate: Joi.number().min(0).max(100),
  animalProgress: Joi.number().min(0).max(100),
  timeEfficiency: Joi.number().min(0).max(100),
  // Add other metrics as needed
}).min(1);

/**
 * Create a new trainer
 * @name POST /
 * @function
 * @memberof module:routes/trainer
 * @param {Object} req.body - Trainer data
 * @returns {Object} Created trainer
 */
router.post('/', 
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize('admin'),
  ValidationMiddleware.validate(trainerSchema),
  TrainerController.createTrainer
);

/**
 * Get trainer by ID
 * @name GET /:id
 * @function
 * @memberof module:routes/trainer
 * @param {string} id - Trainer ID
 * @returns {Object} Trainer data
 */
router.get('/:id', 
  AuthMiddleware.authenticate,
  TrainerController.getTrainerById
);

/**
 * Assign animal to trainer
 * @name PATCH /:trainerId/assign
 * @function
 * @memberof module:routes/trainer
 * @param {string} trainerId - Trainer ID
 * @param {Object} req.body - Contains animalId
 * @returns {Object} Updated trainer
 */
router.patch('/:trainerId/assign', 
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize('admin'),
  TrainerController.assignAnimal
);

/**
 * Add specialty to trainer
 * @name PATCH /:trainerId/specialty
 * @function
 * @memberof module:routes/trainer
 * @param {string} trainerId - Trainer ID
 * @param {Object} req.body - Contains specialty
 * @returns {Object} Updated trainer
 */
router.patch('/:trainerId/specialty', 
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize('admin'),
  ValidationMiddleware.validate(specialtySchema),
  TrainerController.addSpecialty
);

/**
 * Add certification to trainer
 * @name PATCH /:trainerId/certification
 * @function
 * @memberof module:routes/trainer
 * @param {string} trainerId - Trainer ID
 * @param {Object} req.body - Certification data
 * @returns {Object} Updated trainer
 */
router.patch('/:trainerId/certification', 
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize('admin'),
  ValidationMiddleware.validate(certificationSchema),
  TrainerController.addCertification
);

/**
 * Update trainer performance metrics
 * @name PATCH /:trainerId/performance
 * @function
 * @memberof module:routes/trainer
 * @param {string} trainerId - Trainer ID
 * @param {Object} req.body - Performance metrics
 * @returns {Object} Updated trainer
 */
router.patch('/:trainerId/performance', 
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize('admin'),
  ValidationMiddleware.validate(performanceMetricsSchema),
  TrainerController.updatePerformanceMetrics
);

/**
 * Get all trainers
 * @name GET /
 * @function
 * @memberof module:routes/trainer
 * @returns {Array} All trainers
 */
router.get('/', 
  AuthMiddleware.authenticate,
  TrainerController.getAllTrainers
);

/**
 * Update trainer work hours
 * @name PATCH /:trainerId/hours
 * @function
 * @memberof module:routes/trainer
 * @param {string} trainerId - Trainer ID
 * @param {Object} req.body - Contains workHours
 * @returns {Object} Updated trainer
 */
router.patch('/:trainerId/hours', 
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize('admin'),
  TrainerController.updateWorkHours
);

/**
 * Deactivate trainer
 * @name PATCH /:trainerId/deactivate
 * @function
 * @memberof module:routes/trainer
 * @param {string} trainerId - Trainer ID
 * @returns {Object} Deactivated trainer
 */
router.patch('/:trainerId/deactivate', 
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize('admin'),
  TrainerController.deactivateTrainer
);

module.exports = router;