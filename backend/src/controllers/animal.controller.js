const AnimalService = require('../services/animal.service');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/apiError');

class AnimalController {
  // Create a new animal
  static createAnimal = catchAsync(async (req, res) => {
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
    const { id } = req.params;

    const animal = await AnimalService.getAnimalById(id);

    res.status(200).json({
      status: 'success',
      data: animal
    });
  });

  // Update animal status
  static updateAnimalStatus = catchAsync(async (req, res) => {
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
    const { animalType } = req.params;

    const animals = await AnimalService.getAnimalsByType(animalType);

    res.status(200).json({
      status: 'success',
      results: animals.length,
      data: animals
    });
  });
}

module.exports = AnimalController;