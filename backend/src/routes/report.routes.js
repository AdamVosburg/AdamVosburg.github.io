/**
 * Report Routes
 * @module routes/report
 * @description API routes for report generation and management
 */

const express = require('express');
const Joi = require('joi');
const ReportController = require('../controllers/report.controller.js');
const AuthMiddleware = require('../middleware/auth.middleware.js');
const ValidationMiddleware = require('../middleware/validationMiddleware.js');

const router = express.Router();

/**
 * Training report date range schema
 * @type {Joi.ObjectSchema}
 */
const trainingReportSchema = Joi.object({
  startDate: Joi.date().required(),
  endDate: Joi.date().min(Joi.ref('startDate')).required()
});

/**
 * Custom report options schema
 * @type {Joi.ObjectSchema}
 */
const customReportSchema = Joi.object({
  reportType: Joi.string().required(),
  dateRange: Joi.object({
    startDate: Joi.date().required(),
    endDate: Joi.date().min(Joi.ref('startDate')).required()
  }),
  filters: Joi.object().pattern(/^/, Joi.any()),
  groupBy: Joi.string().allow('', null),
  sortBy: Joi.string().allow('', null),
  limit: Joi.number().integer().min(1)
});

/**
 * Export report schema
 * @type {Joi.ObjectSchema}
 */
const exportReportSchema = Joi.object({
  reportType: Joi.string().required(),
  reportData: Joi.object().required()
});

/**
 * Generate animal status report
 * @name GET /animal/:animalId
 * @function
 * @memberof module:routes/report
 * @param {string} animalId - Animal ID
 * @returns {Object} Animal status report
 */
router.get('/animal/:animalId', 
  AuthMiddleware.authenticate,
  ReportController.generateAnimalStatusReport
);

/**
 * Generate training report
 * @name POST /training
 * @function
 * @memberof module:routes/report
 * @param {Object} req.body - Date range for report
 * @returns {Object} Training report
 */
router.post('/training', 
  AuthMiddleware.authenticate,
  ValidationMiddleware.validate(trainingReportSchema),
  ReportController.generateTrainingReport
);

/**
 * Generate medical report
 * @name GET /medical/:animalId
 * @function
 * @memberof module:routes/report
 * @param {string} animalId - Animal ID
 * @returns {Object} Medical report
 */
router.get('/medical/:animalId', 
  AuthMiddleware.authenticate,
  ReportController.generateMedicalReport
);

/**
 * Generate staff report
 * @name GET /staff/:staffId
 * @function
 * @memberof module:routes/report
 * @param {string} staffId - Staff ID
 * @returns {Object} Staff report
 */
router.get('/staff/:staffId', 
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize('admin'),
  ReportController.generateStaffReport
);

/**
 * Build custom report
 * @name POST /custom
 * @function
 * @memberof module:routes/report
 * @param {Object} req.body - Report options
 * @returns {Object} Custom report
 */
router.post('/custom', 
  AuthMiddleware.authenticate,
  ValidationMiddleware.validate(customReportSchema),
  ReportController.buildCustomReport
);

/**
 * Export report to file
 * @name POST /export
 * @function
 * @memberof module:routes/report
 * @param {Object} req.body - Report data to export
 * @returns {Object} Export confirmation with filename
 */
router.post('/export', 
  AuthMiddleware.authenticate,
  ValidationMiddleware.validate(exportReportSchema),
  ReportController.exportReport
);

module.exports = router;