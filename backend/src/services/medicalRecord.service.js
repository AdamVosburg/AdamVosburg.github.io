/**
 * Medical Record Service
 * @module services/medicalRecord
 * @description Provides business logic for medical record management
 */

const MedicalRecord = require('../../models/medical/medicalRecord.model.js');
const Medication = require('../../models/medical/medication.model.js');
const VaccinationSchedule = require('../../models/medical/vaccinationSchedule.model.js');
const RescueAnimal = require('../../models/base/rescueAnimal.js');
const ApiError = require('../utils/apiError.js');
const logger = require('../config/logger.js');

/**
 * Service class for medical record operations
 * @class MedicalRecordService
 */
class MedicalRecordService {
  /**
   * Create a new medical record
   * @static
   * @async
   * @param {Object} recordData - Medical record data
   * @param {string} recordData.animalId - ID of the animal
   * @returns {Promise<Document>} Created medical record
   * @throws {ApiError} If animal is not found or creation fails
   */
  static async createMedicalRecord(recordData) {
    try {
      // Validate animal exists
      const animal = await RescueAnimal.findById(recordData.animalId);
      if (!animal) {
        throw ApiError.notFound('Animal not found');
      }

      const medicalRecord = new MedicalRecord(recordData);
      await medicalRecord.save();

      // Add to animal's medical records
      animal.medicalRecords.push(medicalRecord._id);
      await animal.save();

      return medicalRecord;
    } catch (error) {
      logger.error(`Medical record creation error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get medical record by ID
   * @static
   * @async
   * @param {string} recordId - Medical record ID
   * @returns {Promise<Document>} Medical record document
   * @throws {ApiError} If medical record is not found
   */
  static async getMedicalRecordById(recordId) {
    const medicalRecord = await MedicalRecord.findById(recordId)
      .populate('animalId')
      .populate('veterinarian')
      .populate('medications');
    
    if (!medicalRecord) {
      throw ApiError.notFound('Medical record not found');
    }
    
    return medicalRecord;
  }

  /**
   * Add exam record
   * @static
   * @async
   * @param {Object} examData - Exam data
   * @returns {Promise<Document>} Updated medical record
   * @throws {ApiError} If creation fails
   */
  static async addExamRecord(examData) {
    const medicalRecord = await this.createMedicalRecord({
      ...examData,
      recordType: 'EXAM'
    });

    return medicalRecord.addExamRecord(examData);
  }

  /**
   * Add vaccination record
   * @static
   * @async
   * @param {Object} vaccinationData - Vaccination data
   * @param {string} vaccinationData.animalId - Animal ID
   * @param {string} vaccinationData.vacType - Vaccination type
   * @param {Date} vaccinationData.nextDate - Next vaccination date
   * @returns {Promise<Document>} Updated medical record
   * @throws {ApiError} If creation fails
   */
  static async addVaccination(vaccinationData) {
    // Create medical record
    const medicalRecord = await this.createMedicalRecord({
      ...vaccinationData,
      recordType: 'VACCINATION'
    });

    // Create or update vaccination schedule
    let vacSchedule = await VaccinationSchedule.findOne({ 
      animalId: vaccinationData.animalId 
    });

    if (!vacSchedule) {
      vacSchedule = new VaccinationSchedule({ 
        animalId: vaccinationData.animalId 
      });
    }

    await vacSchedule.addVaccination({
      type: vaccinationData.vacType,
      nextDue: new Date(vaccinationData.nextDate)
    });

    return medicalRecord.addVaccination(vaccinationData);
  }

  /**
   * Add medication to medical record
   * @static
   * @async
   * @param {string} recordId - Medical record ID
   * @param {Object} medicationData - Medication data
   * @returns {Promise<Document>} Created medication
   * @throws {ApiError} If creation fails
   */
  static async addMedication(recordId, medicationData) {
    try {
      // Create medication
      const medication = new Medication(medicationData);
      await medication.save();

      // Find medical record and add medication
      const medicalRecord = await this.getMedicalRecordById(recordId);
      medicalRecord.addMedication(medication._id);

      return medication;
    } catch (error) {
      logger.error(`Medication addition error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get medical records for an animal
   * @static
   * @async
   * @param {string} animalId - Animal ID
   * @returns {Promise<Array<Document>>} Array of medical records
   */
  static async getMedicalRecordsByAnimal(animalId) {
    return MedicalRecord.find({ animalId })
      .populate('veterinarian')
      .populate('medications');
  }

  /**
   * Generate comprehensive medical report
   * @static
   * @async
   * @param {string} animalId - Animal ID
   * @returns {Promise<Object>} Medical report data
   */
  static async generateMedicalReport(animalId) {
    const medicalRecords = await this.getMedicalRecordsByAnimal(animalId);
    const vaccinationSchedule = await VaccinationSchedule.findOne({ animalId });

    return {
      medicalRecords,
      vaccinationSchedule,
      upcomingFollowUps: medicalRecords.filter(record => 
        record.followUpNeeded && 
        new Date(record.followUpDate) > new Date()
      )
    };
  }

  /**
   * Update follow-up status for a medical record
   * @static
   * @async
   * @param {string} recordId - Medical record ID
   * @returns {Promise<Document>} Updated medical record
   * @throws {ApiError} If medical record is not found
   */
  static async updateFollowUpStatus(recordId) {
    const medicalRecord = await this.getMedicalRecordById(recordId);
    return medicalRecord.updateFollowUpStatus();
  }
}

module.exports = MedicalRecordService;