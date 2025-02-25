/**
 * Trainer Controller
 * @module controllers/trainer
 * @description Handles HTTP requests related to trainer management
 */

const TrainerService = require('../services/trainer.service.js');
const catchAsync = require('../utils/catchAsync.js');

/**
 * Controller class for trainer operations
 * @class TrainerController
 */
class TrainerController {
  /**
   * Create a new trainer
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.body - Request body containing trainer data
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with created trainer
   */
  static createTrainer = catchAsync(async (req, res) => {
    const trainerData = req.body;
    const trainer = await TrainerService.createTrainer(trainerData);

    res.status(201).json({
      status: 'success',
      data: trainer
    });
  });

  /**
   * Get trainer by ID
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.id - Trainer ID
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with trainer data
   */
  static getTrainerById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const trainer = await TrainerService.getTrainerById(id);

    res.status(200).json({
      status: 'success',
      data: trainer
    });
  });

  /**
   * Assign an animal to a trainer
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.trainerId - Trainer ID
   * @param {Object} req.body - Request body
   * @param {string} req.body.animalId - Animal ID
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with updated trainer
   */
  static assignAnimal = catchAsync(async (req, res) => {
    const { trainerId } = req.params;
    const { animalId } = req.body;

    const trainer = await TrainerService.assignAnimal(trainerId, animalId);

    res.status(200).json({
      status: 'success',
      data: trainer
    });
  });

  /**
   * Add a specialty to a trainer's profile
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.trainerId - Trainer ID
   * @param {Object} req.body - Request body
   * @param {string} req.body.specialty - Specialty to add
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with updated trainer
   */
  static addSpecialty = catchAsync(async (req, res) => {
    const { trainerId } = req.params;
    const { specialty } = req.body;

    const trainer = await TrainerService.addSpecialty(trainerId, specialty);

    res.status(200).json({
      status: 'success',
      data: trainer
    });
  });

  /**
   * Add a certification to a trainer's profile
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.trainerId - Trainer ID
   * @param {Object} req.body - Request body containing certification data
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with updated trainer
   */
  static addCertification = catchAsync(async (req, res) => {
    const { trainerId } = req.params;
    const certData = req.body;

    const trainer = await TrainerService.addCertification(trainerId, certData);

    res.status(200).json({
      status: 'success',
      data: trainer
    });
  });

  /**
   * Update a trainer's performance metrics
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.trainerId - Trainer ID
   * @param {Object} req.body - Request body containing performance metrics
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with updated trainer
   */
  static updatePerformanceMetrics = catchAsync(async (req, res) => {
    const { trainerId } = req.params;
    const metrics = req.body;

    const trainer = await TrainerService.updatePerformanceMetrics(trainerId, metrics);

    res.status(200).json({
      status: 'success',
      data: trainer
    });
  });

  /**
   * Get all trainers
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with all trainers
   */
  static getAllTrainers = catchAsync(async (req, res) => {
    const trainers = await TrainerService.getAllTrainers();

    res.status(200).json({
      status: 'success',
      results: trainers.length,
      data: trainers
    });
  });

  /**
   * Update a trainer's work hours
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.trainerId - Trainer ID
   * @param {Object} req.body - Request body
   * @param {string} req.body.workHours - Work hours specification
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with updated trainer
   */
  static updateWorkHours = catchAsync(async (req, res) => {
    const { trainerId } = req.params;
    const { workHours } = req.body;

    const trainer = await TrainerService.updateWorkHours(trainerId, workHours);

    res.status(200).json({
      status: 'success',
      data: trainer
    });
  });

  /**
   * Deactivate a trainer
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.trainerId - Trainer ID
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with deactivated trainer
   */
  static deactivateTrainer = catchAsync(async (req, res) => {
    const { trainerId } = req.params;

    const trainer = await TrainerService.deactivateTrainer(trainerId);

    res.status(200).json({
      status: 'success',
      data: trainer
    });
  });
}

module.exports = TrainerController;