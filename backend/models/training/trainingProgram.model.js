/**
 * Training Program Model
 * @module models/training/trainingProgram
 * @description Manages training programs for rescue animals
 */

const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

/**
 * Training Program schema definition
 * @type {mongoose.Schema}
 */
const trainingProgramSchema = new mongoose.Schema({
  programId: {
    type: String,
    default: uuidv4,
    unique: true,
    required: true
  },
  animalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RescueAnimal',
    required: true
  },
  type: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  estimatedEndDate: {
    type: Date,
    required: true
  },
  actualEndDate: {
    type: Date
  },
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trainer',
    required: true
  },
  status: {
    type: String,
    enum: ['Scheduled', 'In Progress', 'Completed', 'Extended'],
    default: 'Scheduled'
  },
  progressReports: [{
    date: Date,
    report: String,
    completionPercentage: Number
  }],
  milestones: [{
    description: String,
    targetDate: Date,
    isComplete: {
      type: Boolean,
      default: false
    },
    completedDate: Date
  }],
  certifications: [{
    type: String,
    issuedDate: Date
  }]
}, {
  timestamps: true
});

/**
 * Starts the training program
 * @returns {Boolean} Whether the program was successfully started
 */
trainingProgramSchema.methods.startProgram = function() {
  if (this.status === 'Scheduled') {
    this.status = 'In Progress';
    this.createInitialAssessment();
    return true;
  }
  return false;
};

/**
 * Creates initial assessment for the program
 * This is called automatically when the program starts
 * @private
 */
trainingProgramSchema.methods.createInitialAssessment = function() {
  // Implementation not provided in original code
  // This would typically create the first progress report
  this.progressReports.push({
    date: new Date(),
    report: "Initial assessment completed",
    completionPercentage: 0
  });
};

/**
 * Adds a progress report to the training program
 * @param {Object} report - Progress report details
 * @param {String} report.report - Report content
 * @param {Number} report.completionPercentage - Percentage of program completed
 */
trainingProgramSchema.methods.addProgressReport = function(report) {
  this.progressReports.push({
    date: new Date(),
    report: report.report,
    completionPercentage: report.completionPercentage
  });
};

/**
 * Adds a milestone to the training program
 * @param {Object} milestone - Milestone details
 * @param {String} milestone.description - Description of the milestone
 * @param {Date} milestone.targetDate - Target date for completion
 */
trainingProgramSchema.methods.addMilestone = function(milestone) {
  this.milestones.push({
    description: milestone.description,
    targetDate: milestone.targetDate
  });
};

/**
 * Evaluates program progression based on completed milestones
 * Triggers program completion if all milestones are complete
 */
trainingProgramSchema.methods.evaluateProgression = function() {
  const completedMilestones = this.milestones.filter(m => m.isComplete).length;
  const totalMilestones = this.milestones.length;
  const progressPercentage = (completedMilestones / totalMilestones) * 100;

  if (progressPercentage === 100) {
    this.completeProgramEvaluation();
  }
};

/**
 * Completes the program evaluation process
 * @private
 */
trainingProgramSchema.methods.completeProgramEvaluation = function() {
  // Implementation not provided in original code
  // This would typically finalize the program
  this.status = 'Completed';
  this.actualEndDate = new Date();
};

/**
 * TrainingProgram model
 * @type {mongoose.Model}
 */
const TrainingProgram = mongoose.model('TrainingProgram', trainingProgramSchema);

module.exports = TrainingProgram;