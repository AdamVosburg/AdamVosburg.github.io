/**
 * Medical Record Controller
 * @module controllers/medicalRecord
 * @description Handles HTTP requests related to animal medical records
 */

const MedicalRecordService = require('../services/medicalRecord.service.js');
const catchAsync = require('../utils/catchAsync.js');

/**
 * Controller class for medical record operations
 * @class MedicalRecordController
 */
class MedicalRecordController {
  /**
   * Create a new medical record
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.body - Request body containing medical record data
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with created medical record
   */
  static createMedicalRecord = catchAsync(async (req, res) => {
    const recordData = req.body;
    const medicalRecord = await MedicalRecordService.createMedicalRecord(recordData);

    res.status(201).json({
      status: 'success',
      data: medicalRecord
    });
  });

  /**
   * Get medical record by ID
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.id - Medical record ID
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with medical record data
   */
  static getMedicalRecordById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const medicalRecord = await MedicalRecordService.getMedicalRecordById(id);

    res.status(200).json({
      status: 'success',
      data: medicalRecord
    });
  });

  /**
   * Add exam record to medical history
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.body - Request body containing exam data
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with updated medical record
   */
  static addExamRecord = catchAsync(async (req, res) => {
    const examData = req.body;
    const medicalRecord = await MedicalRecordService.addExamRecord(examData);

    res.status(201).json({
      status: 'success',
      data: medicalRecord
    });
  });

  /**
   * Add vaccination record to medical history
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.body - Request body containing vaccination data
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with updated medical record
   */
  static addVaccination = catchAsync(async (req, res) => {
    const vaccinationData = req.body;
    const medicalRecord = await MedicalRecordService.addVaccination(vaccinationData);

    res.status(201).json({
      status: 'success',
      data: medicalRecord
    });
  });

  /**
   * Add medication to a medical record
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.recordId - Medical record ID
   * @param {Object} req.body - Request body containing medication data
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with the created medication
   */
  static addMedication = catchAsync(async (req, res) => {
    const { recordId } = req.params;
    const medicationData = req.body;
    const medication = await MedicalRecordService.addMedication(recordId, medicationData);

    res.status(201).json({
      status: 'success',
      data: medication
    });
  });

  /**
   * Get all medical records for a specific animal
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.animalId - Animal ID
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with animal's medical records
   */
  static getMedicalRecordsByAnimal = catchAsync(async (req, res) => {
    const { animalId } = req.params;
    const medicalRecords = await MedicalRecordService.getMedicalRecordsByAnimal(animalId);

    res.status(200).json({
      status: 'success',
      results: medicalRecords.length,
      data: medicalRecords
    });
  });

  /**
   * Generate a comprehensive medical report for an animal
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
    const medicalReport = await MedicalRecordService.generateMedicalReport(animalId);

    res.status(200).json({
      status: 'success',
      data: medicalReport
    });
  });

  /**
   * Update follow-up status for a medical record
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.recordId - Medical record ID
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with updated medical record
   */
  static updateFollowUpStatus = catchAsync(async (req, res) => {
    const { recordId } = req.params;
    const updatedRecord = await MedicalRecordService.updateFollowUpStatus(recordId);

    res.status(200).json({
      status: 'success',
      data: updatedRecord
    });
  });
}

module.exports = MedicalRecordController;