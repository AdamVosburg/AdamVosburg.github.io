const mongoose = require('mongoose');
const RescueAnimal = require('./base/rescueAnimal');
const TrainingProgram = require('./trainingProgram.model');
const MedicalRecord = require('./medicalRecord.model');

const dogSchema = new mongoose.Schema({
  breed: {
    type: String,
    required: true
  },
  serviceType: {
    type: String,
    enum: ['SERVICE', 'THERAPY', 'SEARCH'],
    required: true
  },
  obedienceLevel: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  specializations: [{
    type: String
  }]
});

// Method to get dog specializations
dogSchema.methods.getDogSpecializations = function() {
  return this.specializations;
};

// Method to add specialization
dogSchema.methods.addSpecialization = function(specialization) {
  if (!this.specializations.includes(specialization)) {
    this.specializations.push(specialization);
    return this.save();
  }
  return this;
};

// Initialize medical record
dogSchema.methods.initializeMedicalRecord = async function() {
  try {
    const medicalRecord = new MedicalRecord({
      animalId: this._id,
      veterinarian: null, // This would typically be set by a vet
      recordType: 'EXAM',
      diagnosis: 'Initial intake examination',
      notes: 'Initial medical record for rescue dog'
    });

    await medicalRecord.save();
    
    // Add medical record to animal's records
    this.medicalRecords.push(medicalRecord._id);
    return this.save();
  } catch (error) {
    console.error('Error initializing medical record:', error);
    throw error;
  }
};

// Initialize training program
dogSchema.methods.initializeTrainingProgram = async function(trainer) {
  try {
    const trainingProgram = new TrainingProgram({
      animalId: this._id,
      type: this.serviceType, // Use the dog's service type for training
      trainer: trainer._id,
      status: 'Scheduled'
    });

    await trainingProgram.save();
    
    // Add training program to animal's programs
    this.trainingPrograms.push(trainingProgram._id);
    
    // Set initial training status
    this.trainingStatus = 'In Training';
    
    return this.save();
  } catch (error) {
    console.error('Error initializing training program:', error);
    throw error;
  }
};

// Method to get dog-specific training requirements
dogSchema.methods.getTrainingRequirements = function() {
  const requirements = {
    obedienceBaseline: this.obedienceLevel,
    serviceTypeSpecificTraining: this.serviceType,
    requiredSpecializations: this.getTrainingSpecializations()
  };

  return requirements;
};

// Method to determine training specializations
dogSchema.methods.getTrainingSpecializations = function() {
  switch (this.serviceType) {
    case 'SERVICE':
      return ['Basic Obedience', 'Task Training', 'Public Access'];
    case 'THERAPY':
      return ['Calm Demeanor', 'Social Interaction', 'Stress Management'];
    case 'SEARCH':
      return ['Scent Detection', 'Terrain Navigation', 'Endurance Training'];
    default:
      return [];
  }
};

// Create the Dog model as a discriminator
const Dog = RescueAnimal.discriminator('Dog', dogSchema);

module.exports = Dog;