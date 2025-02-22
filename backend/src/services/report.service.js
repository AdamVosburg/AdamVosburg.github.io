const RescueAnimal = require('../models/base/rescueAnimal');
const Dog = require('../models/dog.model');
const Monkey = require('../models/monkey.model');
const Bird = require('../models/bird.model');
const Horse = require('../models/horse.model');
const TrainingProgram = require('../models/trainingProgram.model');
const MedicalRecord = require('../models/medicalRecord.model');
const Trainer = require('../models/trainer.model');
const ApiError = require('../utils/apiError');
const logger = require('../config/logger');

class ReportService {
  // Generate animal status report
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

  // Generate training report
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

  // Generate medical report
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

  // Generate staff report
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

  // Custom report builder
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

  // Helper method for calculations
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