const express = require('express');
const ReportController = require('../controllers/report.controller');
const AuthMiddleware = require('../middleware/auth.middleware');
const ValidationMiddleware = require('../middleware/validationMiddleware');
const Joi = require('joi');

const router = express.Router();

// Animal Status Report Validation Schema
const animalStatusReportSchema = Joi.object({
  animalId: Joi.string().required()
});

// Training Report Validation Schema
const trainingReportSchema = Joi.object({
  startDate: Joi.date().required(),
  endDate: Joi.date().required()
});

// Staff Report Validation Schema
const staffReportSchema = Joi.object({
  staffId: Joi.string().required()
});

// Custom Report Validation Schema
const customReportSchema = Joi.object({
  reportType: Joi.string().valid('animals', 'trainers', 'medical').required(),
  filters: Joi.object().optional(),
  selectedFields: Joi.array().items(Joi.string()).optional(),
  groupingCriteria: Joi.object().optional(),
  calculations: Joi.array().items(
    Joi.object({
      type: Joi.string().valid('sum', 'average', 'count').required(),
      field: Joi.string().required(),
      name: Joi.string().required()
    })
  ).optional()
});

// Export Report Validation Schema
const exportReportSchema = Joi.object({
  reportType: Joi.string().required(),
  reportData: Joi.alternatives().try(
    Joi.object(),
    Joi.array()
  ).required()
});

// Generate animal status report (protected route)
router.get('/animal-status/:animalId', 
  AuthMiddleware.authenticate,
  ValidationMiddleware.validate(animalStatusReportSchema),
  ReportController.generateAnimalStatusReport
);

// Generate training report (protected route)
router.post('/training', 
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize('admin', 'trainer'),
  ValidationMiddleware.validate(trainingReportSchema),
  ReportController.generateTrainingReport
);

// Generate medical report (protected route)
router.get('/medical/:animalId', 
  AuthMiddleware.authenticate,
  ValidationMiddleware.validate(animalStatusReportSchema),
  ReportController.generateMedicalReport
);

// Generate staff report (protected route)
router.get('/staff/:staffId', 
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize('admin'),
  ValidationMiddleware.validate(staffReportSchema),
  ReportController.generateStaffReport
);

// Build custom report (protected route)
router.post('/custom', 
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize('admin'),
  ValidationMiddleware.validate(customReportSchema),
  ReportController.buildCustomReport
);

// Export report (protected route)
router.post('/export', 
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize('admin'),
  ValidationMiddleware.validate(exportReportSchema),
  ReportController.exportReport
);

module.exports = router;