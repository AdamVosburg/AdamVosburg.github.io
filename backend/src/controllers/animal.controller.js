/**
 * Animal Controller
 * @module controllers/animal
 * @description Handles HTTP requests related to animal management
 */

const AnimalService = require('../services/animal.service.js');
const catchAsync = require('../utils/catchAsync.js');
const ApiError = require('../utils/apiError.js');

/**
 * Controller class for animal-related operations
 * @class AnimalController
 */
class AnimalController {
  /**
   * Create a new animal
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.animalType - Type of animal to create
   * @param {Object} req.body - Request body containing animal data
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with created animal
   */
  static createAnimal = catchAsync(async (req, res) => {
    const { animalType } = req.params;
    const animalData = req.body;

    const animal = await AnimalService.createAnimal(animalType, animalData);

    res.status(201).json({
      status: 'success',
      data: animal
    });
  });

  /**
   * Get animal by ID
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.id - Animal ID
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with animal data
   */
  static getAnimalById = catchAsync(async (req, res) => {
    const { id } = req.params;

    const animal = await AnimalService.getAnimalById(id);

    res.status(200).json({
      status: 'success',
      data: animal
    });
  });

  /**
   * Update animal status
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.id - Animal ID
   * @param {Object} req.body - Request body
   * @param {string} req.body.status - New status for the animal
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with updated animal
   */
  static updateAnimalStatus = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const animal = await AnimalService.updateAnimalStatus(id, status);

    res.status(200).json({
      status: 'success',
      data: animal
    });
  });

  /**
   * Assign trainer to animal
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.animalId - Animal ID
   * @param {Object} req.body - Request body
   * @param {string} req.body.trainerId - Trainer ID
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with updated animal
   */
  static assignTrainer = catchAsync(async (req, res) => {
    const { animalId } = req.params;
    const { trainerId } = req.body;

    const animal = await AnimalService.assignTrainer(animalId, trainerId);

    res.status(200).json({
      status: 'success',
      data: animal
    });
  });

  /**
   * Get animals by type
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.animalType - Type of animal to filter by
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with animals of specified type
   */
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