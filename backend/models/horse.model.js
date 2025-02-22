const mongoose = require('mongoose');
const RescueAnimal = require('./base/rescueAnimal');
const TrainingProgram = require('./trainingProgram.model');
const MedicalRecord = require('./medicalRecord.model');

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

// Initialize horse training
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

// Determine advanced training needs
horseSchema.methods.determineAdvancedTrainingNeeds = function() {
  const advancedTraining = [];

  if (this.ridingSafe) {
    advancedTraining.push('Riding skills');
  }

  if (this.arenaBehavior >= 4) {
    advancedTraining.push('Arena work');
  }

  if (this.trailerLoading >= 4) {
    advancedTraining.push('Trailer loading');
  }

  return advancedTraining;
};

// Determine horse specialization
horseSchema.methods.determineSpecialization = function() {
  if (this.temperament >= 4 && this.groundManners >= 4) {
    return this.ridingSafe ? 'Therapy' : 'Working';
  }
  return 'None';
};

// Initialize therapy assessment
horseSchema.methods.initializeTherapyAssessment = function() {
  const therapyAssessment = {
    suitability: this.assessTherapySuitability(),
    environmentalNeeds: this.determineEnvironmentalNeeds(),
    riderRestrictions: {
      maxWeight: this.maxRiderWeight,
      specialConsiderations: this.generateSpecialConsiderations()
    }
  };

  this.therapyAssessment = therapyAssessment;
  return this.save();
};

// Assess therapy suitability
horseSchema.methods.assessTherapySuitability = function() {
  const suitabilityFactors = [
    this.temperament,
    this.groundManners,
    this.arenaBehavior,
    this.ridingSafe ? 5 : 1  // Bonus points for riding safety
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

// Determine environmental needs
horseSchema.methods.determineEnvironmentalNeeds = function() {
  return {
    spaceRequirements: {
      stableSpace: 'Minimum 12x12 ft stall',
      paddockSpace: 'At least 1 acre per horse',
      shelterType: 'Open-sided barn with wind protection'
    },
    exerciseNeeds: {
      dailyExercise: '1-2 hours',
      exerciseType: [
        'Turnout time',
        'Controlled arena work',
        'Light riding or lunging'
      ]
    },
    specialConsiderations: this.generateSpecialConsiderations()
  };
};

// Generate special considerations
horseSchema.methods.generateSpecialConsiderations = function() {
  const considerations = [];

  if (this.heightHands < 14) {
    considerations.push('Potential pony-specific care');
  }

  if (this.trailerLoading < 3) {
    considerations.push('Requires specialized trailer loading training');
  }

  if (this.temperament <= 2) {
    considerations.push('May need additional behavioral management');
  }

  return considerations;
};

// Initialize veterinary requirements
horseSchema.methods.initializeEquineVetRequirements = function() {
  const vetRequirements = {
    basicCare: [
      'Annual dental exam',
      'Vaccinations',
      'Hoof care every 6-8 weeks'
    ],
    specializedCare: this.determineSpecializedVetCare()
  };

  return vetRequirements;
};

// Determine specialized veterinary care
horseSchema.methods.determineSpecializedVetCare = function() {
  const specializedCare = [];

  if (this.breed === 'Thoroughbred' || this.breed === 'Warmblood') {
    specializedCare.push('Joint health monitoring');
  }

  if (this.heightHands > 17) {
    specializedCare.push('Advanced metabolic screening');
  }

  return specializedCare;
};

// Initialize medical record
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
    console.error('Error initializing medical record:', error);
    throw error;
  }
};

// Initialize training program
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
    console.error('Error initializing training program:', error);
    throw error;
  }
};

// Create the Horse model as a discriminator
const Horse = RescueAnimal.discriminator('Horse', horseSchema);

module.exports = Horse;