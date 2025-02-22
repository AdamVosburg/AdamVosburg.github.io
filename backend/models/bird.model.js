const mongoose = require('mongoose');
const RescueAnimal = require('./base/rescueAnimal');
const TrainingProgram = require('./trainingProgram.model');
const MedicalRecord = require('./medicalRecord.model');

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
  vocalAbility: {
    type: Number,
    min: 1,
    max: 10,
    required: true
  },
  therapyRating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  noiseTolerance: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  socialCompatibility: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  environmentDetails: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  vocalTrainingProgress: [{
    type: String
  }]
});

// Initialize bird environment
birdSchema.methods.initializeBirdEnvironment = function() {
  const environmentDetails = {
    flightSpace: this.flightCapable ? 'Large aviaries with flight paths' : 'Enriched ground habitat',
    perchTypes: ['Various diameter perches', 'Natural branch perches'],
    temperatureRange: '18-28°C',
    humidityLevel: '40-60%',
    lightExposure: 'Natural light cycle with UV supplementation'
  };

  this.environmentDetails = environmentDetails;
  return this.save();
};

// Initialize vocal training
birdSchema.methods.initializeVocalTraining = function() {
  const baseVocalTraining = [
    'Pitch recognition',
    'Sound mimicry basics',
    'Vocalization control'
  ];

  // Extend training based on vocal ability
  const advancedTraining = this.vocalAbility > 7 
    ? ['Complex sound patterns', 'Contextual vocalization']
    : [];

  this.vocalTrainingProgress = [...baseVocalTraining, ...advancedTraining];
  return this.save();
};

// Initialize medical record
birdSchema.methods.initializeMedicalRecord = async function() {
  try {
    const medicalRecord = new MedicalRecord({
      animalId: this._id,
      veterinarian: null,
      recordType: 'EXAM',
      diagnosis: 'Initial avian health assessment',
      notes: `Specific to ${this.species} species`
    });

    await medicalRecord.save();
    
    this.medicalRecords.push(medicalRecord._id);
    return this.save();
  } catch (error) {
    console.error('Error initializing medical record:', error);
    throw error;
  }
};

// Initialize training program
birdSchema.methods.initializeTrainingProgram = async function(trainer) {
  try {
    const trainingProgram = new TrainingProgram({
      animalId: this._id,
      type: this.therapyRating > 3 ? 'Therapy Training' : 'Behavioral Enrichment',
      trainer: trainer._id,
      status: 'Scheduled'
    });

    await trainingProgram.save();
    
    this.trainingPrograms.push(trainingProgram._id);
    this.trainingStatus = 'In Training';
    
    return this.save();
  } catch (error) {
    console.error('Error initializing training program:', error);
    throw error;
  }
};

// Assess therapy potential
birdSchema.methods.assessTherapyPotential = function() {
  return {
    species: this.species,
    therapyRating: this.therapyRating,
    socialCompatibility: this.socialCompatibility,
    vocalAbility: this.vocalAbility,
    therapyFitness: this.calculateTherapyFitness()
  };
};

// Calculate therapy fitness
birdSchema.methods.calculateTherapyFitness = function() {
  const weightedScores = [
    this.therapyRating * 0.4,
    this.socialCompatibility * 0.3,
    (11 - this.noiseTolerance) * 0.3  // Inverse noise tolerance
  ];

  const totalScore = weightedScores.reduce((a, b) => a + b, 0);
  
  return {
    score: totalScore,
    recommendation: 
      totalScore > 7 ? 'Highly Suitable for Therapy' :
      totalScore > 5 ? 'Potentially Suitable' : 
      'Not Recommended for Therapy'
  };
};

// Create the Bird model as a discriminator
const Bird = RescueAnimal.discriminator('Bird', birdSchema);

module.exports = Bird;