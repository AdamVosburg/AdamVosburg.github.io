/**
 * Bird Model - Mongoose discriminator for RescueAnimal
 * @module models/bird
 */

const mongoose = require('mongoose');
const RescueAnimal = require('../base/rescueAnimal');
const TrainingProgram = require('../training/trainingProgram.model');
const MedicalRecord = require('../medical/medicalRecord.model');

/**
 * Bird schema definition
 * @type {mongoose.Schema}
 */
const birdSchema = new mongoose.Schema({
  // Schema definition stays the same
});

/**
 * Initializes the environment parameters for a bird
 * @returns {Object} The updated bird document
 */
birdSchema.methods.initializeBirdEnvironment = function() {
  // Method implementation stays the same
};

// Other methods would be similarly documented here

/**
 * Bird model - Discriminator of RescueAnimal base model
 * @type {mongoose.Model}
 */
const Bird = RescueAnimal.discriminator('Bird', birdSchema);

module.exports = Bird;