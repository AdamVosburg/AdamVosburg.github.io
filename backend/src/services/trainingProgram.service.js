const TrainingProgram = require('../models/trainingProgram.model');
const TrainingSession = require('../models/trainingSession.model');
const RescueAnimal = require('../models/base/rescueAnimal');
const Trainer = require('../models/trainer.model');
const ApiError = require('../utils/apiError');
const logger = require('../config/logger');

class TrainingProgramService {
  // Create a new training program
  static async createTrainingProgram(programData) {
    try {
      // Validate animal exists
      const animal = await RescueAnimal.findById(programData.animalId);
      if (!animal) {
        throw ApiError.notFound('Animal not found');
      }

      // Validate trainer exists
      const trainer = await Trainer.findById(programData.trainer);
      if (!trainer) {
        throw ApiError.notFound('Trainer not found');
      }

      // Calculate estimated end date (default 3 months from start)
      const startDate = new Date();
      const estimatedEndDate = new Date(startDate);
      estimatedEndDate.setMonth(estimatedEndDate.getMonth() + 3);

      const programDataWithDates = {
        ...programData,
        startDate,
        estimatedEndDate
      };

      const trainingProgram = new TrainingProgram(programDataWithDates);
      
      // Start the program
      trainingProgram.startProgram();

      await trainingProgram.save();

      // Update animal's training status
      animal.trainingStatus = 'In Training';
      await animal.save();

      return trainingProgram;
    } catch (error) {
      logger.error(`Training program creation error: ${error.message}`);
      throw error;
    }
  }

  // Get training program by ID
  static async getTrainingProgramById(programId) {
    const program = await TrainingProgram.findById(programId)
      .populate('animalId')
      .populate('trainer');
    
    if (!program) {
      throw ApiError.notFound('Training program not found');
    }
    
    return program;
  }

  // Add progress report to training program
  static async addProgressReport(programId, reportData) {
    const program = await this.getTrainingProgramById(programId);
    
    program.addProgressReport(reportData);
    
    // Evaluate overall program progression
    program.evaluateProgression();
    
    await program.save();
    
    return program;
  }

  // Add milestone to training program
  static async addMilestone(programId, milestoneData) {
    const program = await this.getTrainingProgramById(programId);
    
    program.addMilestone(milestoneData);
    
    await program.save();
    
    return program;
  }

  // Complete training program
  static async completeTrainingProgram(programId) {
    const program = await this.getTrainingProgramById(programId);
    
    program.completeProgramEvaluation();
    
    // Update animal's training status
    const animal = await RescueAnimal.findById(program.animalId);
    if (animal) {
      animal.trainingStatus = program.status === 'Completed' ? 'Ready' : 'In Training';
      await animal.save();
    }
    
    await program.save();
    
    return program;
  }

  // Create a training session
  static async createTrainingSession(sessionData) {
    try {
      // Validate training program exists
      const program = await this.getTrainingProgramById(sessionData.programId);

      const session = new TrainingSession(sessionData);
      await session.save();

      return session;
    } catch (error) {
      logger.error(`Training session creation error: ${error.message}`);
      throw error;
    }
  }

  // Get training sessions for a program
  static async getTrainingSessionsByProgram(programId) {
    return TrainingSession.find({ programId })
      .populate('trainer');
  }

  // Generate program progress report
  static async generateProgramProgressReport(programId) {
    const program = await this.getTrainingProgramById(programId);
    
    const sessions = await this.getTrainingSessionsByProgram(programId);
    
    return {
      program,
      sessions,
      progressReports: program.progressReports,
      milestones: program.milestones,
      certifications: program.certifications
    };
  }
}

module.exports = TrainingProgramService;