console.log('Starting to load horse.model.js');

console.log('About to require dependencies');
const mongoose = require('mongoose');
console.log('Mongoose loaded');

const RescueAnimal = require('../base/rescueAnimal');
console.log('RescueAnimal model loaded');

const TrainingProgram = require('../training/trainingProgram.model');
console.log('TrainingProgram model loaded');

const MedicalRecord = require('../medical/medicalRecord.model');
console.log('MedicalRecord model loaded');
console.log('All dependencies loaded');

console.log('Defining horseSchema');
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
console.log('horseSchema defined');

console.log('Adding schema methods');

horseSchema.methods.initializeHorseTraining = function() {
  console.log('Executing initializeHorseTraining method');
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

horseSchema.methods.initializeMedicalRecord = async function() {
  console.log('Executing initializeMedicalRecord method');
  try {
    const medicalRecord = new MedicalRecord({
      animalId: this._id,
      veterinarian: null,
      recordType: 'EXAM',
      diagnosis: 'Initial equine health assessment',
      notes: `Breed: ${this.breed}, Height: ${this.heightHands} hands`
    });

    await medicalRecord.save();
    console.log('Medical record created successfully');
    
    this.medicalRecords.push(medicalRecord._id);
    return this.save();
  } catch (error) {
    console.error('Error initializing medical record:', error);
    throw error;
  }
};

horseSchema.methods.initializeTrainingProgram = async function(trainer) {
  console.log('Executing initializeTrainingProgram method');
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
    console.log('Training program created successfully');
    
    this.trainingPrograms.push(trainingProgram._id);
    this.trainingStatus = 'In Training';
    
    return this.save();
  } catch (error) {
    console.error('Error initializing training program:', error);
    throw error;
  }
};

horseSchema.methods.determineSpecialization = function() {
  console.log('Executing determineSpecialization method');
  if (this.temperament >= 4 && this.groundManners >= 4) {
    return this.ridingSafe ? 'Therapy' : 'Working';
  }
  return 'None';
};

horseSchema.methods.assessTherapySuitability = function() {
  console.log('Executing assessTherapySuitability method');
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

console.log('Schema methods added');

console.log('Creating Horse model discriminator');
const Horse = RescueAnimal.discriminator('Horse', horseSchema);
console.log('Horse model discriminator created');

console.log('About to export Horse model');
module.exports = Horse;
console.log('Horse model exported');