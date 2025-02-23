console.log('Starting to load dog.model.js');

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

console.log('Defining dogSchema');
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
console.log('dogSchema defined');

console.log('Adding schema methods');

dogSchema.methods.getDogSpecializations = function() {
  console.log('Executing getDogSpecializations method');
  return this.specializations;
};

dogSchema.methods.addSpecialization = function(specialization) {
  console.log('Executing addSpecialization method');
  if (!this.specializations.includes(specialization)) {
    this.specializations.push(specialization);
    return this.save();
  }
  return this;
};

dogSchema.methods.initializeMedicalRecord = async function() {
  console.log('Executing initializeMedicalRecord method');
  try {
    const medicalRecord = new MedicalRecord({
      animalId: this._id,
      veterinarian: null,
      recordType: 'EXAM',
      diagnosis: 'Initial intake examination',
      notes: 'Initial medical record for rescue dog'
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

dogSchema.methods.initializeTrainingProgram = async function(trainer) {
  console.log('Executing initializeTrainingProgram method');
  try {
    const trainingProgram = new TrainingProgram({
      animalId: this._id,
      type: this.serviceType,
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

dogSchema.methods.getTrainingRequirements = function() {
  console.log('Executing getTrainingRequirements method');
  return {
    obedienceBaseline: this.obedienceLevel,
    serviceTypeSpecificTraining: this.serviceType,
    requiredSpecializations: this.getTrainingSpecializations()
  };
};

dogSchema.methods.getTrainingSpecializations = function() {
  console.log('Executing getTrainingSpecializations method');
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
console.log('Schema methods added');

console.log('Creating Dog model discriminator');
const Dog = RescueAnimal.discriminator('Dog', dogSchema);
console.log('Dog model discriminator created');

console.log('About to export Dog model');
module.exports = Dog;
console.log('Dog model exported');