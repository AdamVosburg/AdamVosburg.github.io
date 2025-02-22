const TrainerService = require('../services/trainer.service');
const catchAsync = require('../utils/catchAsync');

class TrainerController {
  // Create a new trainer
  static createTrainer = catchAsync(async (req, res) => {
    const trainerData = req.body;
    const trainer = await TrainerService.createTrainer(trainerData);

    res.status(201).json({
      status: 'success',
      data: trainer
    });
  });

  // Get trainer by ID
  static getTrainerById = catchAsync(async (req, res) => {
    const { id } = req.params;
    const trainer = await TrainerService.getTrainerById(id);

    res.status(200).json({
      status: 'success',
      data: trainer
    });
  });

  // Assign animal to trainer
  static assignAnimal = catchAsync(async (req, res) => {
    const { trainerId } = req.params;
    const { animalId } = req.body;

    const trainer = await TrainerService.assignAnimal(trainerId, animalId);

    res.status(200).json({
      status: 'success',
      data: trainer
    });
  });

  // Add specialty to trainer
  static addSpecialty = catchAsync(async (req, res) => {
    const { trainerId } = req.params;
    const { specialty } = req.body;

    const trainer = await TrainerService.addSpecialty(trainerId, specialty);

    res.status(200).json({
      status: 'success',
      data: trainer
    });
  });

  // Add certification to trainer
  static addCertification = catchAsync(async (req, res) => {
    const { trainerId } = req.params;
    const certData = req.body;

    const trainer = await TrainerService.addCertification(trainerId, certData);

    res.status(200).json({
      status: 'success',
      data: trainer
    });
  });

  // Update trainer performance metrics
  static updatePerformanceMetrics = catchAsync(async (req, res) => {
    const { trainerId } = req.params;
    const metrics = req.body;

    const trainer = await TrainerService.updatePerformanceMetrics(trainerId, metrics);

    res.status(200).json({
      status: 'success',
      data: trainer
    });
  });

  // Get all trainers
  static getAllTrainers = catchAsync(async (req, res) => {
    const trainers = await TrainerService.getAllTrainers();

    res.status(200).json({
      status: 'success',
      results: trainers.length,
      data: trainers
    });
  });

  // Update trainer work hours
  static updateWorkHours = catchAsync(async (req, res) => {
    const { trainerId } = req.params;
    const { workHours } = req.body;

    const trainer = await TrainerService.updateWorkHours(trainerId, workHours);

    res.status(200).json({
      status: 'success',
      data: trainer
    });
  });

  // Deactivate trainer
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