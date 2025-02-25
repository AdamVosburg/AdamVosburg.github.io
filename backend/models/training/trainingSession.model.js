/**
 * Training Session Model
 * @module models/training/trainingSession
 * @description Manages individual training sessions within training programs
 */

const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

/**
 * Training Session schema definition
 * @type {mongoose.Schema}
 */
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

/**
 * Adds a training objective to the session
 * @param {String} objective - Description of the objective
 */
trainingSessionSchema.methods.addObjective = function(objective) {
  this.objectives.push({
    description: objective,
    isComplete: false
  });
};

/**
 * Marks an objective as completed
 * @param {String} objectiveDescription - Description of the objective to complete
 * @returns {Boolean} Whether the objective was found and completed
 */
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

/**
 * Adds notes to the training session
 * @param {String} newNotes - Notes to append
 */
trainingSessionSchema.methods.addNotes = function(newNotes) {
  this.notes += `\n${newNotes}`;
};

/**
 * Generates a summary report of the training session
 * @returns {Object} Session report with completion statistics
 */
trainingSessionSchema.methods.generateSessionReport = function() {
  const completedObjectivesCount = this.objectives.filter(obj => obj.isComplete).length;
  const totalObjectivesCount = this.objectives.length;
  const completionPercentage = totalObjectivesCount > 0 ? 
    (completedObjectivesCount / totalObjectivesCount) * 100 : 0;

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

/**
 * Adds a goal for the next training session
 * @param {Object} goal - Goal details
 * @param {String} goal.description - Description of the goal
 * @param {Date} [goal.targetDate] - Target date for achieving the goal
 */
trainingSessionSchema.methods.addNextSessionGoal = function(goal) {
  this.nextSessionGoals.push({
    description: goal.description,
    targetDate: goal.targetDate || null
  });
};

/**
 * TrainingSession model
 * @type {mongoose.Model}
 */
const TrainingSession = mongoose.model('TrainingSession', trainingSessionSchema);

module.exports = TrainingSession;