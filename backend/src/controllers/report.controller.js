/**
 * Report Controller
 * @module controllers/report
 * @description Handles HTTP requests related to report generation and management
 */

const ReportService = require('../services/report.service.js');
const catchAsync = require('../utils/catchAsync.js');
const fs = require('fs').promises;
const path = require('path');

/**
 * Controller class for report operations
 * @class ReportController
 */
class ReportController {
  /**
   * Generate an animal status report
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.animalId - Animal ID
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with generated animal status report
   */
  static generateAnimalStatusReport = catchAsync(async (req, res) => {
    const { animalId } = req.params;
    const report = await ReportService.generateAnimalStatusReport(animalId);

    res.status(200).json({
      status: 'success',
      data: report
    });
  });

  /**
   * Generate a training report for a specified date range
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.body - Request body
   * @param {Date} req.body.startDate - Start date for the report
   * @param {Date} req.body.endDate - End date for the report
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with generated training report
   */
  static generateTrainingReport = catchAsync(async (req, res) => {
    const { startDate, endDate } = req.body;
    const report = await ReportService.generateTrainingReport({ startDate, endDate });

    res.status(200).json({
      status: 'success',
      data: report
    });
  });

  /**
   * Generate a medical report for a specific animal
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.animalId - Animal ID
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with generated medical report
   */
  static generateMedicalReport = catchAsync(async (req, res) => {
    const { animalId } = req.params;
    const report = await ReportService.generateMedicalReport(animalId);

    res.status(200).json({
      status: 'success',
      data: report
    });
  });

  /**
   * Generate a staff performance report
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.staffId - Staff ID
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with generated staff report
   */
  static generateStaffReport = catchAsync(async (req, res) => {
    const { staffId } = req.params;
    const report = await ReportService.generateStaffReport(staffId);

    res.status(200).json({
      status: 'success',
      data: report
    });
  });

  /**
   * Build a custom report based on provided options
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.body - Request body containing report options
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with generated custom report
   */
  static buildCustomReport = catchAsync(async (req, res) => {
    const reportOptions = req.body;
    const report = await ReportService.buildCustomReport(reportOptions);

    res.status(200).json({
      status: 'success',
      data: report
    });
  });

  /**
   * Export a report to a file
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.body - Request body
   * @param {string} req.body.reportType - Type of report
   * @param {Object} req.body.reportData - Report data to export
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with export status and filename
   */
  static exportReport = catchAsync(async (req, res) => {
    const { reportType, reportData } = req.body;
    
    // Ensure reports directory exists
    const reportsDir = path.join(__dirname, '../../reports');
    await fs.mkdir(reportsDir, { recursive: true });

    // Generate unique filename
    const filename = `${reportType}-report-${Date.now()}.json`;
    const filePath = path.join(reportsDir, filename);

    // Write report to file
    await fs.writeFile(filePath, JSON.stringify(reportData, null, 2));

    res.status(200).json({
      status: 'success',
      message: 'Report exported successfully',
      filename
    });
  });
}

module.exports = ReportController;