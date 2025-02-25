/**
 * Medical Record Routes
 * @module routes/medicalRecord
 * @description API routes for medical record management
 */

const express = require('express');
const Joi = require('joi');
const MedicalRecordController = require('../controllers/medicalRecord.controller.js');
const AuthMiddleware = require('../middleware/auth.middleware.js');
const ValidationMiddleware = require('../middleware/validationMiddleware.js');

const router = express.Router();

/**
 * Medical record schema
 * @type {Joi.ObjectSchema}
 */
const medicalRecordSchema = Joi.object({
  animalId: Joi.string().required(),
  recordType: Joi.string().valid('EXAM', 'VACCINATION', 'TREATMENT', 'FOLLOWUP').required(),
  veterinarian: Joi.string().required(),
  diagnosis: Joi.string().allow('', null),
  treatment: Joi.string().allow('', null),
  notes: Joi.string().allow('', null),
  followUpNeeded: Joi.boolean().default(false),
  followUpDate: Joi.date().when('followUpNeeded', {
    is: true,
    then: Joi.date().required(),
    otherwise: Joi.date().allow(null)
  })
});

/**
 * Vaccination record schema
 * @type {Joi.ObjectSchema}
 */
const vaccinationSchema = Joi.object({
  animalId: Joi.string().required(),
  vacType: Joi.string().required(),
  nextDate: Joi.date().required(),
  veterinarian: Joi.string().required()
});

/**
 * Medication schema
 * @type {Joi.ObjectSchema}
 */
const medicationSchema = Joi.object({
  name: Joi.string().required(),
  dosage: Joi.string().required(),
  frequency: Joi.string().required(),
  startDate: Joi.date().default(Date.now),
  endDate: Joi.date().required(),
  prescribingVet: Joi.string().required(),
  specialInstructions: Joi.string().allow('', null)
});

/**
 * Create a new medical record
 * @name POST /
 * @function
 * @memberof module:routes/medicalRecord
 * @param {Object} req.body - Medical record data
 * @returns {Object} Created medical record
 */
router.post('/', 
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize('veterinarian', 'admin'),
  ValidationMiddleware.validate(medicalRecordSchema),
  MedicalRecordController.createMedicalRecord
);

/**
 * Get medical record by ID
 * @name GET /:id
 * @function
 * @memberof module:routes/medicalRecord
 * @param {string} id - Medical record ID
 * @returns {Object} Medical record data
 */
router.get('/:id', 
  AuthMiddleware.authenticate,
  MedicalRecordController.getMedicalRecordById
);

/**
 * Add exam record
 * @name POST /exam
 * @function
 * @memberof module:routes/medicalRecord
 * @param {Object} req.body - Exam data
 * @returns {Object} Updated medical record
 */
router.post('/exam', 
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize('veterinarian', 'admin'),
  MedicalRecordController.addExamRecord
);

/**
 * Add vaccination record
 * @name POST /vaccination
 * @function
 * @memberof module:routes/medicalRecord
 * @param {Object} req.body - Vaccination data
 * @returns {Object} Updated medical record
 */
router.post('/vaccination', 
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize('veterinarian', 'admin'),
  ValidationMiddleware.validate(vaccinationSchema),
  MedicalRecordController.addVaccination
);

/**
 * Add medication to medical record
 * @name POST /:recordId/medication
 * @function
 * @memberof module:routes/medicalRecord
 * @param {string} recordId - Medical record ID
 * @param {Object} req.body - Medication data
 * @returns {Object} Created medication
 */
router.post('/:recordId/medication', 
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize('veterinarian', 'admin'),
  ValidationMiddleware.validate(medicationSchema),
  MedicalRecordController.addMedication
);

/**
 * Get medical records for an animal
 * @name GET /animal/:animalId
 * @function
 * @memberof module:routes/medicalRecord
 * @param {string} animalId - Animal ID
 * @returns {Array} Medical records for the animal
 */
router.get('/animal/:animalId', 
  AuthMiddleware.authenticate,
  MedicalRecordController.getMedicalRecordsByAnimal
);

/**
 * Generate medical report for an animal
 * @name GET /animal/:animalId/report
 * @function
 * @memberof module:routes/medicalRecord
 * @param {string} animalId - Animal ID
 * @returns {Object} Generated medical report
 */
router.get('/animal/:animalId/report', 
  AuthMiddleware.authenticate,
  MedicalRecordController.generateMedicalReport
);

/**
 * Update follow-up status for a medical record
 * @name PATCH /:recordId/follow-up
 * @function
 * @memberof module:routes/medicalRecord
 * @param {string} recordId - Medical record ID
 * @returns {Object} Updated medical record
 */
router.patch('/:recordId/follow-up', 
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize('veterinarian', 'admin'),
  MedicalRecordController.updateFollowUpStatus
);

module.exports = router;