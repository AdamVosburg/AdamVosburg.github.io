/**
 * Trainer Service
 * @module services/trainer
 * @description Provides business logic for trainer management
 */

const Trainer = require('../../models/training/trainer.model.js');
const RescueAnimal = require('../../models/base/rescueAnimal.js');
const ApiError = require('../utils/apiError.js');
const logger = require('../config/logger.js');

/**
 * Service class for trainer operations
 * @class TrainerService
 */
class TrainerService {
  /**
   * Create a new trainer
   * @static
   * @async
   * @param {Object} trainerData - Trainer data
   * @returns {Promise<Document>} Created trainer document
   * @throws {ApiError} If creation fails
   */
  static async createTrainer(trainerData) {
    try {
      const trainer = new Trainer(trainerData);
      return await trainer.save();
    } catch (error) {
      logger.error(`Trainer creation error: ${error.message}`);
      throw ApiError.badRequest('Failed to create trainer');
    }
  }

  /**
   * Get trainer by ID
   * @static
   * @async
   * @param {string} trainerId - Trainer ID
   * @returns {Promise<Document>} Trainer document
   * @throws {ApiError} If trainer is not found
   */
  static async getTrainerById(trainerId) {
    const trainer = await Trainer.findById(trainerId)
      .populate('assignedAnimals');
    
    if (!trainer) {
      throw ApiError.notFound('Trainer not found');
    }
    
    return trainer;
  }

  /**
   * Assign animal to trainer
   * @static
   * @async
   * @param {string} trainerId - Trainer ID
   * @param {string} animalId - Animal ID
   * @returns {Promise<Document>} Updated trainer document
   * @throws {ApiError} If trainer or animal is not found, or if trainer has reached maximum workload
   */
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

  /**
   * Add specialty to trainer
   * @static
   * @async
   * @param {string} trainerId - Trainer ID
   * @param {string} specialty - Specialty to add
   * @returns {Promise<Document>} Updated trainer document
   * @throws {ApiError} If trainer is not found
   */
  static async addSpecialty(trainerId, specialty) {
    const trainer = await this.getTrainerById(trainerId);
    trainer.addSpecialty(specialty);
    return trainer;
  }

  /**
   * Add certification to trainer
   * @static
   * @async
   * @param {string} trainerId - Trainer ID
   * @param {Object} certData - Certification data
   * @returns {Promise<Document>} Updated trainer document
   * @throws {ApiError} If trainer is not found
   */
  static async addCertification(trainerId, certData) {
    const trainer = await this.getTrainerById(trainerId);
    trainer.addCertification(certData);
    return trainer;
  }

  /**
   * Update trainer performance metrics
   * @static
   * @async
   * @param {string} trainerId - Trainer ID
   * @param {Object} metrics - Performance metrics
   * @returns {Promise<Document>} Updated trainer document
   * @throws {ApiError} If trainer is not found
   */
  static async updatePerformanceMetrics(trainerId, metrics) {
    const trainer = await this.getTrainerById(trainerId);
    return trainer.updatePerformanceMetrics(metrics);
  }

  /**
   * Get all trainers
   * @static
   * @async
   * @returns {Promise<Array<Document>>} Array of trainer documents
   */
  static async getAllTrainers() {
    return Trainer.find().populate('assignedAnimals');
  }

  /**
   * Update trainer work hours
   * @static
   * @async
   * @param {string} trainerId - Trainer ID
   * @param {string} workHours - Work hours specification
   * @returns {Promise<Document>} Updated trainer document
   * @throws {ApiError} If trainer is not found
   */
  static async updateWorkHours(trainerId, workHours) {
    const trainer = await this.getTrainerById(trainerId);
    return trainer.updateWorkHours(workHours);
  }

  /**
   * Deactivate trainer
   * @static
   * @async
   * @param {string} trainerId - Trainer ID
   * @returns {Promise<Document>} Updated trainer document
   * @throws {ApiError} If trainer is not found
   */
  static async deactivateTrainer(trainerId) {
    const trainer = await this.getTrainerById(trainerId);
    trainer.activeStatus = false;
    return trainer.save();
  }
}

module.exports = TrainerService;