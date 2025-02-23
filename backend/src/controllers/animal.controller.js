console.log('Starting to load animal.controller.js');

console.log('About to require animal.service');
const AnimalService = require('../services/animal.service');
console.log('AnimalService loaded');

console.log('About to require catchAsync');
const catchAsync = require('../utils/catchAsync');
console.log('catchAsync loaded');

console.log('About to require apiError');
const ApiError = require('../utils/apiError');
console.log('ApiError loaded');

console.log('Defining AnimalController class');
class AnimalController {
  // Create a new animal
  static createAnimal = catchAsync(async (req, res) => {
    console.log('Executing createAnimal');
    const { animalType } = req.params;
    const animalData = req.body;

    const animal = await AnimalService.createAnimal(animalType, animalData);

    res.status(201).json({
      status: 'success',
      data: animal
    });
  });

  // Get animal by ID
  static getAnimalById = catchAsync(async (req, res) => {
    console.log('Executing getAnimalById');
    const { id } = req.params;

    const animal = await AnimalService.getAnimalById(id);

    res.status(200).json({
      status: 'success',
      data: animal
    });
  });

  // Update animal status
  static updateAnimalStatus = catchAsync(async (req, res) => {
    console.log('Executing updateAnimalStatus');
    const { id } = req.params;
    const { status } = req.body;

    const animal = await AnimalService.updateAnimalStatus(id, status);

    res.status(200).json({
      status: 'success',
      data: animal
    });
  });

  // Assign trainer to animal
  static assignTrainer = catchAsync(async (req, res) => {
    console.log('Executing assignTrainer');
    const { animalId } = req.params;
    const { trainerId } = req.body;

    const animal = await AnimalService.assignTrainer(animalId, trainerId);

    res.status(200).json({
      status: 'success',
      data: animal
    });
  });

  // Get animals by type
  static getAnimalsByType = catchAsync(async (req, res) => {
    console.log('Executing getAnimalsByType');
    const { animalType } = req.params;

    const animals = await AnimalService.getAnimalsByType(animalType);

    res.status(200).json({
      status: 'success',
      results: animals.length,
      data: animals
    });
  });
}

console.log('About to export AnimalController');
module.exports = AnimalController;
console.log('AnimalController exported');