/**
 * Training Program Controller
 * @module controllers/trainingProgram
 * @description Handles HTTP requests related to training programs and sessions
 */

const TrainingProgramService = require('../services/trainingProgram.service.js');
const catchAsync = require('../utils/catchAsync.js');

/**
 * Controller class for training program operations
 * @class TrainingProgramController
 */
class TrainingProgramController {
  /**
   * Create a new training program
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.body - Request body containing program data
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with created training program
   */
  static createTrainingProgram = catchAsync(async (req, res) => {
    const programData = req.body;
    const trainingProgram = await TrainingProgramService.createTrainingProgram(programData);

    res.status(201).json({
      status: 'success',
      data: trainingProgram
    });
  });

  /**
   * Get training program by ID
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.id - Training program ID
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with training program data
   */
  static getTrainingProgramById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const trainingProgram = await TrainingProgramService.getTrainingProgramById(id);

    res.status(200).json({
      status: 'success',
      data: trainingProgram
    });
  });

  /**
   * Add progress report to a training program
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.programId - Training program ID
   * @param {Object} req.body - Request body containing report data
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with updated training program
   */
  static addProgressReport = catchAsync(async (req, res) => {
    const { programId } = req.params;
    const reportData = req.body;

    const trainingProgram = await TrainingProgramService.addProgressReport(programId, reportData);

    res.status(200).json({
      status: 'success',
      data: trainingProgram
    });
  });

  /**
   * Add milestone to a training program
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.programId - Training program ID
   * @param {Object} req.body - Request body containing milestone data
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with updated training program
   */
  static addMilestone = catchAsync(async (req, res) => {
    const { programId } = req.params;
    const milestoneData = req.body;

    const trainingProgram = await TrainingProgramService.addMilestone(programId, milestoneData);

    res.status(200).json({
      status: 'success',
      data: trainingProgram
    });
  });

  /**
   * Mark a training program as complete
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.programId - Training program ID
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with completed training program
   */
  static completeTrainingProgram = catchAsync(async (req, res) => {
    const { programId } = req.params;

    const trainingProgram = await TrainingProgramService.completeTrainingProgram(programId);

    res.status(200).json({
      status: 'success',
      data: trainingProgram
    });
  });

  /**
   * Create a new training session
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.body - Request body containing session data
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with created training session
   */
  static createTrainingSession = catchAsync(async (req, res) => {
    const sessionData = req.body;

    const trainingSession = await TrainingProgramService.createTrainingSession(sessionData);

    res.status(201).json({
      status: 'success',
      data: trainingSession
    });
  });

  /**
   * Get all training sessions for a specific program
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.programId - Training program ID
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with list of training sessions
   */
  static getTrainingSessionsByProgram = catchAsync(async (req, res) => {
    const { programId } = req.params;

    const trainingSessions = await TrainingProgramService.getTrainingSessionsByProgram(programId);

    res.status(200).json({
      status: 'success',
      results: trainingSessions.length,
      data: trainingSessions
    });
  });

  /**
   * Generate a progress report for a training program
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.params - Request parameters
   * @param {string} req.params.programId - Training program ID
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with program progress report
   */
  static generateProgramProgressReport = catchAsync(async (req, res) => {
    const { programId } = req.params;

    const progressReport = await TrainingProgramService.generateProgramProgressReport(programId);

    res.status(200).json({
      status: 'success',
      data: progressReport
    });
  });
}

module.exports = TrainingProgramController;