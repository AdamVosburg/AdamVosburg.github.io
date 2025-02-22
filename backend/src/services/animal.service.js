const RescueAnimal = require('../models/base/rescueAnimal');
const Dog = require('../models/dog.model');
const Monkey = require('../models/monkey.model');
const Bird = require('../models/bird.model');
const Horse = require('../models/horse.model');
const ApiError = require('../utils/apiError');
const logger = require('../config/logger');

class AnimalService {
  // Factory method to create animal based on type
  static async createAnimal(animalType, animalData) {
    try {
      let animal;
      switch (animalType.toLowerCase()) {
        case 'dog':
          animal = new Dog(animalData);
          break;
        case 'monkey':
          animal = new Monkey(animalData);
          break;
        case 'bird':
          animal = new Bird(animalData);
          break;
        case 'horse':
          animal = new Horse(animalData);
          break;
        default:
          throw ApiError.badRequest('Invalid animal type');
      }

      // Log animal intake
      logger.info(`New ${animalType} intake: ${animal.id}`);

      return await animal.save();
    } catch (error) {
      logger.error(`Animal intake error: ${error.message}`);
      throw ApiError.internalServer('Failed to create animal record');
    }
  }

  // Get animal by ID
  static async getAnimalById(id) {
    const animal = await RescueAnimal.findById(id);
    if (!animal) {
      throw ApiError.notFound('Animal not found');
    }
    return animal;
  }

  // Update animal status
  static async updateAnimalStatus(id, status) {
    const animal = await this.getAnimalById(id);
    animal.trainingStatus = status;
    return await animal.save();
  }

  // Assign trainer
  static async assignTrainer(animalId, trainerId) {
    const animal = await this.getAnimalById(animalId);
    animal.assignedTrainer = trainerId;
    return await animal.save();
  }

  // Get animals by type
  static async getAnimalsByType(type) {
    switch (type.toLowerCase()) {
      case 'dog':
        return await Dog.find();
      case 'monkey':
        return await Monkey.find();
      case 'bird':
        return await Bird.find();
      case 'horse':
        return await Horse.find();
      default:
        throw ApiError.badRequest('Invalid animal type');
    }
  }

  // Additional methods can be added as needed
}

module.exports = AnimalService;