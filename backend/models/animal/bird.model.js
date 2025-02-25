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
  species: {
    type: String,
    required: true
  },
  wingspan: {
    type: Number,
    required: true
  },
  flightCapable: {
    type: Boolean,
    required: true
  },
  migratory: {
    type: Boolean,
    required: true
  },
  dietType: {
    type: String,
    enum: ['Omnivore', 'Carnivore', 'Herbivore', 'Insectivore'],
    required: true
  },
  vocalCapabilities: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  specialNeeds: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
});

/**
 * Initializes the environment parameters for a bird
 * @returns {Promise<Document>} Updated bird document
 */
birdSchema.methods.initializeBirdEnvironment = function() {
  // Set environmental parameters based on species and capabilities
  const environmentRequirements = {
    cageSize: this.wingspan * 3,
    perchTypes: ['Natural', 'Rope'],
    enrichmentItems: ['Mirrors', 'Foraging toys'],
    lightingNeeds: this.migratory ? 'Seasonal variations' : 'Standard'
  };
  
  this.specialNeeds = {
    ...this.specialNeeds,
    environment: environmentRequirements
  };
  
  return this.save();
};

/**
 * Creates and initializes a medical record for the bird
 * @returns {Promise<Document>} Updated bird document with medical record reference
 * @throws {Error} If medical record creation fails
 */
birdSchema.methods.initializeMedicalRecord = async function() {
  try {
    const medicalRecord = new MedicalRecord({
      animalId: this._id,
      veterinarian: null,
      recordType: 'EXAM',
      diagnosis: 'Initial avian health assessment',
      notes: `Species: ${this.species}, Flight capable: ${this.flightCapable ? 'Yes' : 'No'}`
    });

    await medicalRecord.save();
    
    this.medicalRecords.push(medicalRecord._id);
    return this.save();
  } catch (error) {
    throw error;
  }
};

/**
 * Determines if the bird is suitable for rehabilitation and release
 * @returns {Object} Assessment with score and recommendation
 */
birdSchema.methods.assessReleaseCapability = function() {
  const factors = [
    this.flightCapable ? 5 : 0,
    this.migratory ? (this.flightCapable ? 5 : 1) : 3,
    this.specialNeeds.injuries ? 5 - Object.keys(this.specialNeeds.injuries).length : 5
  ];
  
  const capabilityScore = factors.reduce((sum, factor) => sum + factor, 0) / factors.length;
  
  return {
    score: capabilityScore,
    recommendation: 
      capabilityScore > 4 ? 'Suitable for rehabilitation and release' :
      capabilityScore > 2 ? 'May require permanent sanctuary' :
      'Not suitable for release'
  };
};

/**
 * Creates and initializes a training program for the bird
 * @param {Object} trainer - The trainer object with _id
 * @returns {Promise<Document>} Updated bird document with training program reference
 * @throws {Error} If training program creation fails
 */
birdSchema.methods.initializeTrainingProgram = async function(trainer) {
  try {
    const trainingType = this.vocalCapabilities > 3 ? 
      'Vocal Training' : 'Basic Behavioral Training';
    
    const trainingProgram = new TrainingProgram({
      animalId: this._id,
      type: trainingType,
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
 * Gets dietary requirements based on bird's attributes
 * @returns {Object} Dietary requirements object
 */
birdSchema.methods.getDietaryRequirements = function() {
  const dietMap = {
    'Omnivore': ['Seeds', 'Fruits', 'Insects', 'Vegetables'],
    'Carnivore': ['Meat', 'Fish', 'Insects'],
    'Herbivore': ['Seeds', 'Fruits', 'Vegetables', 'Greens'],
    'Insectivore': ['Insects', 'Mealworms', 'Cricket']
  };
  
  return {
    foodTypes: dietMap[this.dietType] || [],
    feedingSchedule: this.migratory ? 'Seasonal variations' : 'Regular',
    supplements: this.specialNeeds.dietarySupplements || []
  };
};

/**
 * Bird model - Discriminator of RescueAnimal base model
 * @type {mongoose.Model}
 */
const Bird = RescueAnimal.discriminator('Bird', birdSchema);

module.exports = Bird;