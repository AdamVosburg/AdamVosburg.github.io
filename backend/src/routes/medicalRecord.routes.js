const express = require('express');
const MedicalRecordController = require('../controllers/medicalRecord.controller');
const AuthMiddleware = require('../middleware/auth.middleware');
const ValidationMiddleware = require('../middleware/validationMiddleware');
const Joi = require('joi');

const router = express.Router();

// Medical Record Creation Validation Schema
const medicalRecordSchema = Joi.object({
  animalId: Joi.string().required(),
  veterinarian: Joi.string().required(),
  recordType: Joi.string().valid('EXAM', 'VACCINATION', 'TREATMENT', 'FOLLOWUP').required()
});

// Exam Record Validation Schema
const examRecordSchema = Joi.object({
  animalId: Joi.string().required(),
  veterinarian: Joi.string().required(),
  diagnosis: Joi.string().required(),
  treatment: Joi.string().required(),
  followUp: Joi.boolean(),
  followUpDate: Joi.date().when('followUp', { is: true, then: Joi.required() })
});

// Vaccination Record Validation Schema
const vaccinationSchema = Joi.object({
  animalId: Joi.string().required(),
  veterinarian: Joi.string().required(),
  vacType: Joi.string().required(),
  nextDate: Joi.date().required()
});

// Medication Validation Schema
const medicationSchema = Joi.object({
  name: Joi.string().required(),
  dosage: Joi.string().required(),
  frequency: Joi.string().required(),
  startDate: Joi.date().default(Date.now),
  endDate: Joi.date().required(),
  prescribingVet: Joi.string().required(),
  specialInstructions: Joi.string()
});

// Create a new medical record (protected route)
router.post('/', 
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize('admin', 'veterinarian'),
  ValidationMiddleware.validate(medicalRecordSchema),
  MedicalRecordController.createMedicalRecord
);

// Get medical record by ID (protected route)
router.get('/:id', 
  AuthMiddleware.authenticate,
  MedicalRecordController.getMedicalRecordById
);

// Add exam record (protected route)
router.post('/exam', 
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize('admin', 'veterinarian'),
  ValidationMiddleware.validate(examRecordSchema),
  MedicalRecordController.addExamRecord
);

// Add vaccination record (protected route)
router.post('/vaccination', 
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize('admin', 'veterinarian'),
  ValidationMiddleware.validate(vaccinationSchema),
  MedicalRecordController.addVaccination
);

// Add medication to medical record (protected route)
router.post('/:recordId/medications', 
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize('admin', 'veterinarian'),
  ValidationMiddleware.validate(medicationSchema),
  MedicalRecordController.addMedication
);

// Get medical records for an animal (protected route)
router.get('/animal/:animalId', 
  AuthMiddleware.authenticate,
  MedicalRecordController.getMedicalRecordsByAnimal
);

// Generate comprehensive medical report (protected route)
router.get('/report/:animalId', 
  AuthMiddleware.authenticate,
  MedicalRecordController.generateMedicalReport
);

// Update follow-up status (protected route)
router.patch('/:recordId/follow-up', 
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize('admin', 'veterinarian'),
  MedicalRecordController.updateFollowUpStatus
);

module.exports = router;