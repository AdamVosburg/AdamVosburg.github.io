console.log('Starting to load trainingSession.model.js');

console.log('About to require dependencies');
const mongoose = require('mongoose');
console.log('Mongoose loaded');

const { v4: uuidv4 } = require('uuid');
console.log('uuid loaded');
console.log('All dependencies loaded');

console.log('Defining trainingSessionSchema');
const trainingSessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    default: uuidv4,
    unique: true,
    required: true
  },
  programId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TrainingProgram',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  duration: {
    type: Number,
    required: true
  },
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trainer',
    required: true
  },
  objectives: [{
    description: String,
    isComplete: {
      type: Boolean,
      default: false
    }
  }],
  completedItems: [{
    description: String,
    completedAt: Date
  }],
  notes: {
    type: String,
    default: ''
  },
  nextSessionGoals: [{
    description: String,
    targetDate: Date
  }]
}, {
  timestamps: true
});
console.log('trainingSessionSchema defined');

console.log('Adding schema methods');

trainingSessionSchema.methods.addObjective = function(objective) {
  console.log('Executing addObjective method');
  this.objectives.push({
    description: objective,
    isComplete: false
  });
};

trainingSessionSchema.methods.completeObjective = function(objectiveDescription) {
  console.log('Executing completeObjective method');
  const objective = this.objectives.find(
    obj => obj.description === objectiveDescription
  );

  if (objective) {
    objective.isComplete = true;
    this.completedItems.push({
      description: objectiveDescription,
      completedAt: new Date()
    });
    return true;
  }
  return false;
};

trainingSessionSchema.methods.addNotes = function(newNotes) {
  console.log('Executing addNotes method');
  this.notes += `\n${newNotes}`;
};

trainingSessionSchema.methods.generateSessionReport = function() {
  console.log('Executing generateSessionReport method');
  const completedObjectivesCount = this.objectives.filter(obj => obj.isComplete).length;
  const totalObjectivesCount = this.objectives.length;
  const completionPercentage = (completedObjectivesCount / totalObjectivesCount) * 100;

  return {
    sessionId: this.sessionId,
    date: this.date,
    duration: this.duration,
    trainer: this.trainer,
    completionPercentage,
    completedItems: this.completedItems,
    notes: this.notes,
    nextSessionGoals: this.nextSessionGoals
  };
};

console.log('Schema methods added');

console.log('Creating TrainingSession model');
const TrainingSession = mongoose.model('TrainingSession', trainingSessionSchema);
console.log('TrainingSession model created');

console.log('About to export TrainingSession model');
module.exports = TrainingSession;
console.log('TrainingSession model exported');