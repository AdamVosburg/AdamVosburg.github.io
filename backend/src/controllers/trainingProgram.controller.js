const TrainingProgramService = require('../services/trainingProgram.service');
const catchAsync = require('../utils/catchAsync');

class TrainingProgramController {
  // Create a new training program
  static createTrainingProgram = catchAsync(async (req, res) => {
    const programData = req.body;
    const trainingProgram = await TrainingProgramService.createTrainingProgram(programData);

    res.status(201).json({
      status: 'success',
      data: trainingProgram
    });
  });

  // Get training program by ID
  static getTrainingProgramById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const trainingProgram = await TrainingProgramService.getTrainingProgramById(id);

    res.status(200).json({
      status: 'success',
      data: trainingProgram
    });
  });

  // Add progress report to training program
  static addProgressReport = catchAsync(async (req, res) => {
    const { programId } = req.params;
    const reportData = req.body;

    const trainingProgram = await TrainingProgramService.addProgressReport(programId, reportData);

    res.status(200).json({
      status: 'success',
      data: trainingProgram
    });
  });

  // Add milestone to training program
  static addMilestone = catchAsync(async (req, res) => {
    const { programId } = req.params;
    const milestoneData = req.body;

    const trainingProgram = await TrainingProgramService.addMilestone(programId, milestoneData);

    res.status(200).json({
      status: 'success',
      data: trainingProgram
    });
  });

  // Complete training program
  static completeTrainingProgram = catchAsync(async (req, res) => {
    const { programId } = req.params;

    const trainingProgram = await TrainingProgramService.completeTrainingProgram(programId);

    res.status(200).json({
      status: 'success',
      data: trainingProgram
    });
  });

  // Create a training session
  static createTrainingSession = catchAsync(async (req, res) => {
    const sessionData = req.body;

    const trainingSession = await TrainingProgramService.createTrainingSession(sessionData);

    res.status(201).json({
      status: 'success',
      data: trainingSession
    });
  });

  // Get training sessions for a program
  static getTrainingSessionsByProgram = catchAsync(async (req, res) => {
    const { programId } = req.params;

    const trainingSessions = await TrainingProgramService.getTrainingSessionsByProgram(programId);

    res.status(200).json({
      status: 'success',
      results: trainingSessions.length,
      data: trainingSessions
    });
  });

  // Generate program progress report
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