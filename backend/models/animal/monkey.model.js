/**
 * Monkey Model - Mongoose discriminator for RescueAnimal
 * @module models/monkey
 */

const mongoose = require('mongoose');
const RescueAnimal = require('../base/rescueAnimal');
const TrainingProgram = require('../training/trainingProgram.model');
const MedicalRecord = require('../medical/medicalRecord.model');

/**
 * Monkey schema definition
 * @type {mongoose.Schema}
 */
const monkeySchema = new mongoose.Schema({
  species: {
    type: String,
    enum: ['Capuchin', 'Guenon', 'Macaque', 'Marmoset', 'Squirrel', 'Tamarin'],
    required: true
  },
  tailLength: {
    type: Number,
    required: true
  },
  height: {
    type: Number,
    required: true
  },
  bodyLength: {
    type: Number,
    required: true
  },
  dexterityLevel: {
    type: Number,
    min: 1,
    max: 10,
    required: true
  },
  toolUseCapability: {
    type: Boolean,
    required: true
  },
  environmentalNeeds: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  cognitiveTasks: [{
    type: String
  }]
});

/**
 * Initializes species-specific environmental needs
 * @returns {Promise<Document>} Updated monkey document
 */
monkeySchema.methods.initializeEnvironmentalNeeds = function() {
  const environmentalNeedsMap = {
    'Capuchin': {
      habitat: 'Tropical forest enclosure',
      temperature: '22-28°C',
      humidity: '60-80%',
      enrichmentActivities: ['Puzzle feeders', 'Climbing structures']
    },
    // ... other species maps
  };

  this.environmentalNeeds = environmentalNeedsMap[this.species] || {};
  return this.save();
};

/**
 * Creates and initializes a medical record for the monkey
 * @returns {Promise<Document>} Updated monkey document with medical record reference
 * @throws {Error} If medical record creation fails
 */
monkeySchema.methods.initializeMedicalRecord = async function() {
  try {
    const medicalRecord = new MedicalRecord({
      animalId: this._id,
      veterinarian: null,
      recordType: 'EXAM',
      diagnosis: 'Initial primate health assessment',
      notes: `Specific to ${this.species} species`
    });

    await medicalRecord.save();
    
    this.medicalRecords.push(medicalRecord._id);
    return this.save();
  } catch (error) {
    throw error;
  }
};

/**
 * Creates and initializes a training program for the monkey
 * @param {Object} trainer - The trainer object with _id
 * @returns {Promise<Document>} Updated monkey document with training program reference
 * @throws {Error} If training program creation fails
 */
monkeySchema.methods.initializeTrainingProgram = async function(trainer) {
  try {
    const trainingProgram = new TrainingProgram({
      animalId: this._id,
      type: 'Cognitive Enrichment',
      trainer: trainer._id,
      status: 'Scheduled'
    });

    await trainingProgram.save();
    
    this.trainingPrograms.push(trainingProgram._id);
    this.trainingStatus = 'In Training';
    
    return this.save();
  } catch (error) {
    throw error;
  }
};

/**
 * Monkey model - Discriminator of RescueAnimal base model
 * @type {mongoose.Model}
 */
const Monkey = RescueAnimal.discriminator('Monkey', monkeySchema);

module.exports = Monkey;