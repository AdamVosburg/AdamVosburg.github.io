/**
 * Report Service
 * @module services/report
 * @description Provides business logic for report generation
 */

const RescueAnimal = require('../../models/base/rescueAnimal.js');
const Dog = require('../../models/animal/dog.model.js');
const Monkey = require('../../models/animal/monkey.model.js');
const Bird = require('../../models/animal/bird.model.js');
const Horse = require('../../models/animal/horse.model.js');
const TrainingProgram = require('../../models/training/trainingProgram.model.js');
const MedicalRecord = require('../../models/medical/medicalRecord.model.js');
const Trainer = require('../../models/training/trainer.model.js');
const ApiError = require('../utils/apiError.js');
const logger = require('../config/logger.js');

/**
 * Service class for report generation operations
 * @class ReportService
 */
class ReportService {
  /**
   * Generate animal status report
   * @static
   * @async
   * @param {string} animalId - Animal ID
   * @returns {Promise<Object>} Animal status report
   * @throws {ApiError} If animal is not found
   */
  static async generateAnimalStatusReport(animalId) {
    const animal = await RescueAnimal.findById(animalId)
      .populate('medicalRecords')
      .populate('trainingPrograms')
      .populate('assignedTrainer');

    if (!animal) {
      throw ApiError.notFound('Animal not found');
    }

    return {
      basicInfo: {
        id: animal.id,
        name: animal.name,
        species: animal.constructor.modelName,
        gender: animal.gender,
        age: animal.age,
        weight: animal.weight
      },
      trainingStatus: {
        currentStatus: animal.trainingStatus,
        reserved: animal.reserved,
        inServiceCountry: animal.inServiceCountry
      },
      medicalInfo: {
        medicalRecords: animal.medicalRecords,
        specialNeeds: animal.specialNeeds
      },
      trainingPrograms: animal.trainingPrograms
    };
  }

  /**
   * Generate training report
   * @static
   * @async
   * @param {Object} dateRange - Date range for the report
   * @param {Date} dateRange.startDate - Start date
   * @param {Date} dateRange.endDate - End date
   * @returns {Promise<Object>} Training report
   */
  static async generateTrainingReport(dateRange) {
    const { startDate, endDate } = dateRange;

    const trainingPrograms = await TrainingProgram.find({
      startDate: { $gte: startDate, $lte: endDate }
    })
    .populate('animalId')
    .populate('trainer');

    const reportData = trainingPrograms.map(program => ({
      programId: program.programId,
      animal: program.animalId,
      trainer: program.trainer,
      type: program.type,
      startDate: program.startDate,
      estimatedEndDate: program.estimatedEndDate,
      status: program.status,
      progressReports: program.progressReports,
      milestones: program.milestones,
      certificationStatus: program.certifications.length > 0
    }));

    // Calculate training metrics
    const metrics = {
      totalPrograms: reportData.length,
      completedPrograms: reportData.filter(p => p.status === 'Completed').length,
      inProgressPrograms: reportData.filter(p => p.status === 'In Progress').length,
      certifiedPrograms: reportData.filter(p => p.certificationStatus).length
    };

    return {
      programs: reportData,
      metrics
    };
  }

  /**
   * Generate medical report
   * @static
   * @async
   * @param {string} animalId - Animal ID
   * @returns {Promise<Object>} Medical report
   * @throws {ApiError} If no medical records are found
   */
  static async generateMedicalReport(animalId) {
    const medicalRecords = await MedicalRecord.find({ animalId })
      .populate('medications')
      .sort({ dateOfService: -1 });

    if (medicalRecords.length === 0) {
      throw ApiError.notFound('No medical records found');
    }

    const vaccinationHistory = medicalRecords.filter(
      record => record.recordType === 'VACCINATION'
    );

    const treatmentHistory = medicalRecords.filter(
      record => record.recordType === 'TREATMENT'
    );

    return {
      vaccinationHistory,
      treatmentHistory,
      upcomingAppointments: medicalRecords.filter(
        record => record.followUpNeeded && 
        new Date(record.followUpDate) > new Date()
      ),
      medicationSchedule: medicalRecords.flatMap(record => record.medications)
    };
  }

  /**
   * Generate staff report
   * @static
   * @async
   * @param {string} staffId - Staff (trainer) ID
   * @returns {Promise<Object>} Staff report
   * @throws {ApiError} If trainer is not found
   */
  static async generateStaffReport(staffId) {
    const trainer = await Trainer.findById(staffId)
      .populate('assignedAnimals');

    if (!trainer) {
      throw ApiError.notFound('Trainer not found');
    }

    return {
      trainerInfo: {
        id: trainer.trainerId,
        name: trainer.name,
        specialties: trainer.specialties,
        certifications: trainer.certifications,
        workHours: trainer.workHours,
        contactInfo: trainer.contactInfo
      },
      currentWorkload: {
        assignedAnimals: trainer.assignedAnimals,
        currentLoad: trainer.assignedAnimals.length,
        workloadCapacity: trainer.workloadCapacity
      },
      performanceMetrics: trainer.performanceMetrics
    };
  }

  /**
   * Build a custom report
   * @static
   * @async
   * @param {Object} options - Report options
   * @param {string} options.reportType - Type of report to build
   * @param {Object} [options.filters={}] - Report filters
   * @param {Array<string>} [options.selectedFields=[]] - Fields to include
   * @param {Object} [options.groupingCriteria] - Grouping criteria
   * @param {Array<Object>} [options.calculations=[]] - Calculations to perform
   * @returns {Promise<Array>} Custom report results
   * @throws {ApiError} If report type is invalid
   */
  static async buildCustomReport(options) {
    const { 
      reportType, 
      filters = {}, 
      selectedFields = [], 
      groupingCriteria, 
      calculations = [] 
    } = options;

    let baseQuery;
    switch (reportType) {
      case 'animals':
        baseQuery = RescueAnimal.find(filters);
        break;
      case 'trainers':
        baseQuery = Trainer.find(filters);
        break;
      case 'medical':
        baseQuery = MedicalRecord.find(filters);
        break;
      default:
        throw ApiError.badRequest('Invalid report type');
    }

    // Apply field selection
    if (selectedFields.length > 0) {
      const projection = selectedFields.reduce((acc, field) => {
        acc[field] = 1;
        return acc;
      }, {});
      baseQuery.select(projection);
    }

    // Perform grouping if specified
    if (groupingCriteria) {
      baseQuery.group(groupingCriteria);
    }

    // Perform calculations
    const results = await baseQuery.exec();
    
    // Apply additional calculations
    const processedResults = results.map(result => {
      calculations.forEach(calc => {
        result[calc.name] = this.performCalculation(result, calc);
      });
      return result;
    });

    return processedResults;
  }

  /**
   * Helper method for calculations
   * @static
   * @private
   * @param {Object} data - Data to perform calculation on
   * @param {Object} calculation - Calculation to perform
   * @param {string} calculation.type - Type of calculation
   * @param {string} calculation.field - Field to calculate on
   * @returns {number} Calculation result
   * @throws {Error} If calculation type is unsupported
   */
  static performCalculation(data, calculation) {
    switch (calculation.type) {
      case 'sum':
        return data[calculation.field].reduce((a, b) => a + b, 0);
      case 'average':
        const sum = data[calculation.field].reduce((a, b) => a + b, 0);
        return sum / data[calculation.field].length;
      case 'count':
        return data[calculation.field].length;
      default:
        throw new Error('Unsupported calculation type');
    }
  }
}

module.exports = ReportService;