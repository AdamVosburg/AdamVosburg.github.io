const path = require('path');
const fs = require('fs');

console.log('Starting to load animal.service.js');
console.log('Current directory:', process.cwd());

const modelsPath = path.join(__dirname, '..', '..', 'models');
console.log('Models directory:', modelsPath);

function checkFileExists(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    console.log(`File exists: ${filePath}`);
    return true;
  } catch (err) {
    console.error(`File does not exist: ${filePath}`);
    return false;
  }
}

console.log('About to require rescueAnimal model');
let RescueAnimal;
const rescueAnimalPath = path.join(modelsPath, 'base', 'rescueAnimal.js');
if (checkFileExists(rescueAnimalPath)) {
  RescueAnimal = require(rescueAnimalPath);
  console.log('RescueAnimal model loaded successfully');
} else {
  console.error('RescueAnimal file not found');
}

const models = {};
const modelFiles = ['animal/dog.model.js', 'animal/monkey.model.js', 'animal/bird.model.js', 'animal/horse.model.js'];

modelFiles.forEach(file => {
  const modelName = file.split('.')[0].charAt(0).toUpperCase() + file.split('.')[0].slice(1);
  const modelPath = path.join(modelsPath, file);
  if (checkFileExists(modelPath)) {
    models[modelName] = require(modelPath);
    console.log(`${modelName} model loaded successfully`);
  } else {
    console.error(`${modelName} model file not found`);
  }
});

console.log('About to require apiError');
let ApiError;
const apiErrorPath = path.join(__dirname, '..', 'utils', 'apiError.js');
if (checkFileExists(apiErrorPath)) {
  ApiError = require(apiErrorPath);
  console.log('ApiError loaded successfully');
} else {
  console.error('ApiError file not found');
}

console.log('About to require logger');
let logger;
const loggerPath = path.join(__dirname, '..', 'config', 'logger.js');
if (checkFileExists(loggerPath)) {
  logger = require(loggerPath);
  console.log('Logger loaded successfully');
} else {
  console.error('Logger file not found');
}

console.log('Defining AnimalService class');
class AnimalService {
  static async createAnimal(animalType, animalData) {
    console.log('Entering createAnimal method');
    try {
      let animal;
      const Model = models[animalType.charAt(0).toUpperCase() + animalType.slice(1)];
      if (!Model) {
        console.log('Invalid animal type');
        throw ApiError.badRequest('Invalid animal type');
      }
      animal = new Model(animalData);

      console.log(`Logging new ${animalType} intake`);
      logger.info(`New ${animalType} intake: ${animal.id}`);

      console.log('Saving animal');
      return await animal.save();
    } catch (error) {
      console.error('Error in createAnimal:', error);
      logger.error(`Animal intake error: ${error.message}`);
      throw ApiError.internalServer('Failed to create animal record');
    }
  }

  static async getAnimalById(id) {
    console.log(`Entering getAnimalById method with id: ${id}`);
    const animal = await RescueAnimal.findById(id);
    if (!animal) {
      console.log('Animal not found');
      throw ApiError.notFound('Animal not found');
    }
    console.log('Animal found');
    return animal;
  }

  static async updateAnimalStatus(id, status) {
    console.log(`Entering updateAnimalStatus method for animal ${id} with status ${status}`);
    const animal = await this.getAnimalById(id);
    animal.trainingStatus = status;
    console.log('Saving updated animal status');
    return await animal.save();
  }

  static async assignTrainer(animalId, trainerId) {
    console.log(`Entering assignTrainer method for animal ${animalId} with trainer ${trainerId}`);
    const animal = await this.getAnimalById(animalId);
    animal.assignedTrainer = trainerId;
    console.log('Saving assigned trainer');
    return await animal.save();
  }

  static async getAnimalsByType(type) {
    console.log(`Entering getAnimalsByType method for type: ${type}`);
    const Model = models[type.charAt(0).toUpperCase() + type.slice(1)];
    if (!Model) {
      console.log('Invalid animal type');
      throw ApiError.badRequest('Invalid animal type');
    }
    return await Model.find();
  }
}

console.log('About to export AnimalService');
module.exports = AnimalService;
console.log('AnimalService exported');
