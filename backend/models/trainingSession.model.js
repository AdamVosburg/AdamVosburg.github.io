const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const trainingSessionSchema = new mongoose.Schema({
  // Unique Identifier
  sessionId: {
    type: String,
    default: uuidv4,
    unique: true,
    required: true
  },

  // Program Association
  programId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TrainingProgram',
    required: true
  },

  // Session Details
  date: {
    type: Date,
    default: Date.now
  },
  duration: {
    type: Number, // duration in minutes
    required: true
  },

  // Trainer Information
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trainer',
    required: true
  },

  // Training Objectives and Progress
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

  // Session Notes and Next Steps
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

// Method to add an objective
trainingSessionSchema.methods.addObjective = function(objective) {
  this.objectives.push({
    description: objective,
    isComplete: false
  });
};

// Method to complete an objective
trainingSessionSchema.methods.completeObjective = function(objectiveDescription) {
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

// Method to add notes
trainingSessionSchema.methods.addNotes = function(newNotes) {
  this.notes += `\n${newNotes}`;
};

// Method to set next session goals
trainingSessionSchema.methods.setNextSessionGoals = function(goals) {
  // Clear existing goals and add new ones
  this.nextSessionGoals = goals.map(goal => ({
    description: goal.description,
    targetDate: goal.targetDate || null
  }));
};

// Method to generate session report
trainingSessionSchema.methods.generateSessionReport = function() {
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

const TrainingSession = mongoose.model('TrainingSession', trainingSessionSchema);

module.exports = TrainingSession;