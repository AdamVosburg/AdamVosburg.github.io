/**
 * Horse Model - Mongoose discriminator for RescueAnimal
 * @module models/horse
 */

const mongoose = require('mongoose');
const RescueAnimal = require('../base/rescueAnimal');
const TrainingProgram = require('../training/trainingProgram.model');
const MedicalRecord = require('../medical/medicalRecord.model');

/**
 * Horse schema definition
 * @type {mongoose.Schema}
 */
const horseSchema = new mongoose.Schema({
  breed: {
    type: String,
    required: true
  },
  heightHands: {
    type: Number,
    required: true
  },
  temperament: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  ridingSafe: {
    type: Boolean,
    required: true
  },
  groundManners: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  maxRiderWeight: {
    type: Number,
    required: true
  },
  arenaBehavior: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  trailerLoading: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  trainingSpecialization: {
    type: String,
    enum: ['Therapy', 'Riding', 'Working', 'None'],
    default: 'None'
  },
  therapyAssessment: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
});

/**
 * Initializes horse training parameters and identifies specialization
 * @returns {Promise<Document>} Updated horse document
 */
horseSchema.methods.initializeHorseTraining = function() {
  const trainingRequirements = {
    basicTraining: [
      'Ground handling',
      'Basic obedience',
      'Desensitization'
    ],
    advancedTraining: this.determineAdvancedTrainingNeeds()
  };

  this.trainingSpecialization = this.determineSpecialization();
  return this.save();
};

/**
 * Creates and initializes a medical record for the horse
 * @returns {Promise<Document>} Updated horse document with medical record reference
 * @throws {Error} If medical record creation fails
 */
horseSchema.methods.initializeMedicalRecord = async function() {
  try {
    const medicalRecord = new MedicalRecord({
      animalId: this._id,
      veterinarian: null,
      recordType: 'EXAM',
      diagnosis: 'Initial equine health assessment',
      notes: `Breed: ${this.breed}, Height: ${this.heightHands} hands`
    });

    await medicalRecord.save();
    
    this.medicalRecords.push(medicalRecord._id);
    return this.save();
  } catch (error) {
    throw error;
  }
};

/**
 * Creates and initializes a training program for the horse
 * @param {Object} trainer - The trainer object with _id
 * @returns {Promise<Document>} Updated horse document with training program reference
 * @throws {Error} If training program creation fails
 */
horseSchema.methods.initializeTrainingProgram = async function(trainer) {
  try {
    const trainingProgram = new TrainingProgram({
      animalId: this._id,
      type: this.trainingSpecialization !== 'None' 
        ? this.trainingSpecialization + ' Training' 
        : 'Basic Equine Training',
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
 * Determines appropriate specialization based on horse's attributes
 * @returns {String} Training specialization
 */
horseSchema.methods.determineSpecialization = function() {
  if (this.temperament >= 4 && this.groundManners >= 4) {
    return this.ridingSafe ? 'Therapy' : 'Working';
  }
  return 'None';
};

/**
 * Assesses horse's suitability for therapy work
 * @returns {Object} Assessment with score and recommendation
 */
horseSchema.methods.assessTherapySuitability = function() {
  const suitabilityFactors = [
    this.temperament,
    this.groundManners,
    this.arenaBehavior,
    this.ridingSafe ? 5 : 1
  ];

  const averageSuitability = 
    suitabilityFactors.reduce((a, b) => a + b, 0) / suitabilityFactors.length;

  return {
    score: averageSuitability,
    recommendation: 
      averageSuitability > 4 ? 'Highly Suitable for Therapy' :
      averageSuitability > 3 ? 'Potentially Suitable' : 
      'Not Recommended for Therapy'
  };
};

/**
 * Horse model - Discriminator of RescueAnimal base model
 * @type {mongoose.Model}
 */
const Horse = RescueAnimal.discriminator('Horse', horseSchema);

module.exports = Horse;