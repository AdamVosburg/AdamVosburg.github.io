const ReportService = require('../services/report.service.js');
const catchAsync = require('../utils/catchAsync.js');
const fs = require('fs').promises;
const path = require('path');

class ReportController {
  // Generate animal status report
  static generateAnimalStatusReport = catchAsync(async (req, res) => {
    const { animalId } = req.params;
    const report = await ReportService.generateAnimalStatusReport(animalId);

    res.status(200).json({
      status: 'success',
      data: report
    });
  });

  // Generate training report
  static generateTrainingReport = catchAsync(async (req, res) => {
    const { startDate, endDate } = req.body;
    const report = await ReportService.generateTrainingReport({ startDate, endDate });

    res.status(200).json({
      status: 'success',
      data: report
    });
  });

  // Generate medical report
  static generateMedicalReport = catchAsync(async (req, res) => {
    const { animalId } = req.params;
    const report = await ReportService.generateMedicalReport(animalId);

    res.status(200).json({
      status: 'success',
      data: report
    });
  });

  // Generate staff report
  static generateStaffReport = catchAsync(async (req, res) => {
    const { staffId } = req.params;
    const report = await ReportService.generateStaffReport(staffId);

    res.status(200).json({
      status: 'success',
      data: report
    });
  });

  // Build custom report
  static buildCustomReport = catchAsync(async (req, res) => {
    const reportOptions = req.body;
    const report = await ReportService.buildCustomReport(reportOptions);

    res.status(200).json({
      status: 'success',
      data: report
    });
  });

  // Export report to file
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