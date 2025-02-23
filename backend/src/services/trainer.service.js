const Trainer = require('../../models/training/trainer.model.js');
const RescueAnimal = require('../../models/base/rescueAnimal.js');
const ApiError = require('../utils/apiError.js');
const logger = require('../config/logger.js');

class TrainerService {
  // Create a new trainer
  static async createTrainer(trainerData) {
    try {
      const trainer = new Trainer(trainerData);
      return await trainer.save();
    } catch (error) {
      logger.error(`Trainer creation error: ${error.message}`);
      throw ApiError.badRequest('Failed to create trainer');
    }
  }

  // Get trainer by ID
  static async getTrainerById(trainerId) {
    const trainer = await Trainer.findById(trainerId)
      .populate('assignedAnimals');
    
    if (!trainer) {
      throw ApiError.notFound('Trainer not found');
    }
    
    return trainer;
  }

  // Assign animal to trainer
  static async assignAnimal(trainerId, animalId) {
    try {
      const trainer = await this.getTrainerById(trainerId);
      const animal = await RescueAnimal.findById(animalId);

      if (!animal) {
        throw ApiError.notFound('Animal not found');
      }

      if (!trainer.canAcceptAnimal()) {
        throw ApiError.badRequest('Trainer has reached maximum workload');
      }

      trainer.assignAnimal(animalId);
      animal.assignedTrainer = trainerId;

      await Promise.all([trainer.save(), animal.save()]);

      return trainer;
    } catch (error) {
      logger.error(`Animal assignment error: ${error.message}`);
      throw error;
    }
  }

  // Add specialty to trainer
  static async addSpecialty(trainerId, specialty) {
    const trainer = await this.getTrainerById(trainerId);
    trainer.addSpecialty(specialty);
    return trainer;
  }

  // Add certification to trainer
  static async addCertification(trainerId, certData) {
    const trainer = await this.getTrainerById(trainerId);
    trainer.addCertification(certData);
    return trainer;
  }

  // Update trainer performance metrics
  static async updatePerformanceMetrics(trainerId, metrics) {
    const trainer = await this.getTrainerById(trainerId);
    return trainer.updatePerformanceMetrics(metrics);
  }

  // Get all trainers
  static async getAllTrainers() {
    return Trainer.find().populate('assignedAnimals');
  }

  // Update trainer work hours
  static async updateWorkHours(trainerId, workHours) {
    const trainer = await this.getTrainerById(trainerId);
    return trainer.updateWorkHours(workHours);
  }

  // Deactivate trainer
  static async deactivateTrainer(trainerId) {
    const trainer = await this.getTrainerById(trainerId);
    trainer.activeStatus = false;
    return trainer.save();
  }
}

module.exports = TrainerService;