console.log('Starting to load trainingProgram.model.js');

console.log('About to require mongoose');
const mongoose = require('mongoose');
console.log('Mongoose loaded successfully');

console.log('About to require uuid');
const { v4: uuidv4 } = require('uuid');
console.log('uuid loaded successfully');

console.log('Defining trainingProgramSchema');
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
console.log('trainingProgramSchema defined');

console.log('Defining schema methods');
trainingProgramSchema.methods.startProgram = function() {
  console.log('Executing startProgram method');
  if (this.status === 'Scheduled') {
    this.status = 'In Progress';
    this.createInitialAssessment();
    return true;
  }
  return false;
};

trainingProgramSchema.methods.addProgressReport = function(report) {
  console.log('Executing addProgressReport method');
  this.progressReports.push({
    date: new Date(),
    report: report.report,
    completionPercentage: report.completionPercentage
  });
};

trainingProgramSchema.methods.addMilestone = function(milestone) {
  console.log('Executing addMilestone method');
  this.milestones.push({
    description: milestone.description,
    targetDate: milestone.targetDate
  });
};

trainingProgramSchema.methods.evaluateProgression = function() {
  console.log('Executing evaluateProgression method');
  const completedMilestones = this.milestones.filter(m => m.isComplete).length;
  const totalMilestones = this.milestones.length;
  const progressPercentage = (completedMilestones / totalMilestones) * 100;

  if (progressPercentage === 100) {
    this.completeProgramEvaluation();
  }
};
console.log('Schema methods defined');

console.log('Creating TrainingProgram model');
const TrainingProgram = mongoose.model('TrainingProgram', trainingProgramSchema);
console.log('TrainingProgram model created');

console.log('About to export TrainingProgram model');
module.exports = TrainingProgram;
console.log('TrainingProgram model exported');