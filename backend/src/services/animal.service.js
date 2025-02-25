/**
 * Animal Service
 * @module services/animal
 * @description Provides business logic for animal management
 */

const path = require('path');
const RescueAnimal = require('../../models/base/rescueAnimal.js');
const Dog = require('../../models/animal/dog.model.js');
const Monkey = require('../../models/animal/monkey.model.js');
const Bird = require('../../models/animal/bird.model.js');
const Horse = require('../../models/animal/horse.model.js');
const ApiError = require('../utils/apiError.js');
const logger = require('../config/logger.js');

/**
 * Service class for animal-related operations
 * @class AnimalService
 */
class AnimalService {
  /**
   * Create a new animal
   * @static
   * @async
   * @param {string} animalType - Type of animal to create
   * @param {Object} animalData - Animal data
   * @returns {Promise<Document>} Created animal document
   * @throws {ApiError} If animal type is invalid or creation fails
   */
  static async createAnimal(animalType, animalData) {
    try {
      let animal;
      const capitalizedType = animalType.charAt(0).toUpperCase() + animalType.slice(1);
      const Model = {
        'Dog': Dog,
        'Monkey': Monkey,
        'Bird': Bird,
        'Horse': Horse
      }[capitalizedType];

      if (!Model) {
        throw ApiError.badRequest('Invalid animal type');
      }
      
      animal = new Model(animalData);
      logger.info(`New ${animalType} intake: ${animal.id}`);
      
      return await animal.save();
    } catch (error) {
      logger.error(`Animal intake error: ${error.message}`);
      throw ApiError.internalServer('Failed to create animal record');
    }
  }

  /**
   * Get animal by ID
   * @static
   * @async
   * @param {string} id - Animal ID
   * @returns {Promise<Document>} Animal document
   * @throws {ApiError} If animal is not found
   */
  static async getAnimalById(id) {
    const animal = await RescueAnimal.findById(id);
    if (!animal) {
      throw ApiError.notFound('Animal not found');
    }
    return animal;
  }

  /**
   * Update animal status
   * @static
   * @async
   * @param {string} id - Animal ID
   * @param {string} status - New status
   * @returns {Promise<Document>} Updated animal document
   * @throws {ApiError} If animal is not found
   */
  static async updateAnimalStatus(id, status) {
    const animal = await this.getAnimalById(id);
    animal.trainingStatus = status;
    return await animal.save();
  }

  /**
   * Assign trainer to animal
   * @static
   * @async
   * @param {string} animalId - Animal ID
   * @param {string} trainerId - Trainer ID
   * @returns {Promise<Document>} Updated animal document
   * @throws {ApiError} If animal is not found
   */
  static async assignTrainer(animalId, trainerId) {
    const animal = await this.getAnimalById(animalId);
    animal.assignedTrainer = trainerId;
    return await animal.save();
  }

  /**
   * Get animals by type
   * @static
   * @async
   * @param {string} type - Type of animal to filter by
   * @returns {Promise<Array<Document>>} Array of animal documents
   * @throws {ApiError} If animal type is invalid
   */
  static async getAnimalsByType(type) {
    const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
    const Model = {
      'Dog': Dog,
      'Monkey': Monkey,
      'Bird': Bird,
      'Horse': Horse
    }[capitalizedType];
    
    if (!Model) {
      throw ApiError.badRequest('Invalid animal type');
    }
    
    return await Model.find();
  }
}

module.exports = AnimalService;