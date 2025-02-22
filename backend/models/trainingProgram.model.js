const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const trainingProgramSchema = new mongoose.Schema({
  // Unique Identifier
  programId: {
    type: String,
    default: uuidv4,
    unique: true,
    required: true
  },

  // Animal Information
  animalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RescueAnimal',
    required: true
  },

  // Program Details
  type: {
    type: String,
    required: true
  },

  // Dates
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

  // Trainer Assignment
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trainer',
    required: true
  },

  // Program Status
  status: {
    type: String,
    enum: ['Scheduled', 'In Progress', 'Completed', 'Extended'],
    default: 'Scheduled'
  },

  // Progress Tracking
  progressReports: [{
    date: Date,
    report: String,
    completionPercentage: Number
  }],

  // Milestones
  milestones: [{
    description: String,
    targetDate: Date,
    isComplete: {
      type: Boolean,
      default: false
    },
    completedDate: Date
  }],

  // Certifications
  certifications: [{
    type: String,
    issuedDate: Date
  }]
}, {
  timestamps: true
});

// Method to start the program
trainingProgramSchema.methods.startProgram = function() {
  if (this.status === 'Scheduled') {
    this.status = 'In Progress';
    this.createInitialAssessment();
    return true;
  }
  return false;
};

// Method to add progress report
trainingProgramSchema.methods.addProgressReport = function(report) {
  this.progressReports.push({
    date: new Date(),
    report: report.report,
    completionPercentage: report.completionPercentage
  });
  this.updateAnimalStatus();
};

// Method to add milestone
trainingProgramSchema.methods.addMilestone = function(milestone) {
  const newMilestone = {
    description: milestone.description,
    targetDate: milestone.targetDate
  };
  
  this.milestones.push(newMilestone);
};

// Method to evaluate program progression
trainingProgramSchema.methods.evaluateProgression = function() {
  const completedMilestones = this.milestones.filter(m => m.isComplete).length;
  const totalMilestones = this.milestones.length;
  const progressPercentage = (completedMilestones / totalMilestones) * 100;

  if (progressPercentage === 100) {
    this.completeProgramEvaluation();
  }
};

// Method to complete program evaluation
trainingProgramSchema.methods.completeProgramEvaluation = function() {
  const allMilestonesCompleted = this.milestones.every(m => m.isComplete);
  
  if (allMilestonesCompleted) {
    this.status = 'Completed';
    this.actualEndDate = new Date();
    this.issueCertifications();
  } else {
    this.status = 'Extended';
    this.adjustEstimatedEndDate();
  }
};

// Method to issue certifications
trainingProgramSchema.methods.issueCertifications = function() {
  // Placeholder for certification logic
  this.certifications.push({
    type: `${this.type} Completion Certificate`,
    issuedDate: new Date()
  });
};

// Method to adjust estimated end date
trainingProgramSchema.methods.adjustEstimatedEndDate = function() {
  // Extend estimated end date by a default period
  const extensionPeriod = new Date();
  extensionPeriod.setMonth(extensionPeriod.getMonth() + 1);
  this.estimatedEndDate = extensionPeriod;
};

// Method to create initial assessment
trainingProgramSchema.methods.createInitialAssessment = function() {
  // Placeholder for initial assessment logic
  this.progressReports.push({
    date: new Date(),
    report: 'Initial program assessment',
    completionPercentage: 0
  });
};

const TrainingProgram = mongoose.model('TrainingProgram', trainingProgramSchema);

module.exports = TrainingProgram;