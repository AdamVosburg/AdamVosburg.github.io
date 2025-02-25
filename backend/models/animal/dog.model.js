/**
 * Dog Model - Mongoose discriminator for RescueAnimal
 * @module models/dog
 */

const mongoose = require('mongoose');
const RescueAnimal = require('../base/rescueAnimal');
const TrainingProgram = require('../training/trainingProgram.model');
const MedicalRecord = require('../medical/medicalRecord.model');

/**
 * Dog schema definition
 * @type {mongoose.Schema}
 */
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

/**
 * Returns dog's specializations
 * @returns {Array<String>} List of specializations
 */
dogSchema.methods.getDogSpecializations = function() {
  return this.specializations;
};

/**
 * Adds a specialization to the dog's profile if not already present
 * @param {String} specialization - The specialization to add
 * @returns {Promise<Document>} Updated dog document
 */
dogSchema.methods.addSpecialization = function(specialization) {
  if (!this.specializations.includes(specialization)) {
    this.specializations.push(specialization);
    return this.save();
  }
  return this;
};

/**
 * Creates and initializes a medical record for the dog
 * @returns {Promise<Document>} Updated dog document with medical record reference
 * @throws {Error} If medical record creation fails
 */
dogSchema.methods.initializeMedicalRecord = async function() {
  try {
    const medicalRecord = new MedicalRecord({
      animalId: this._id,
      veterinarian: null,
      recordType: 'EXAM',
      diagnosis: 'Initial intake examination',
      notes: 'Initial medical record for rescue dog'
    });

    await medicalRecord.save();
    
    this.medicalRecords.push(medicalRecord._id);
    return this.save();
  } catch (error) {
    throw error;
  }
};

/**
 * Creates and initializes a training program for the dog
 * @param {Object} trainer - The trainer object with _id
 * @returns {Promise<Document>} Updated dog document with training program reference
 * @throws {Error} If training program creation fails
 */
dogSchema.methods.initializeTrainingProgram = async function(trainer) {
  try {
    const trainingProgram = new TrainingProgram({
      animalId: this._id,
      type: this.serviceType,
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
 * Gets training requirements based on dog's attributes
 * @returns {Object} Training requirements object
 */
dogSchema.methods.getTrainingRequirements = function() {
  return {
    obedienceBaseline: this.obedienceLevel,
    serviceTypeSpecificTraining: this.serviceType,
    requiredSpecializations: this.getTrainingSpecializations()
  };
};

/**
 * Determines training specializations based on service type
 * @returns {Array<String>} List of required specializations
 */
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

/**
 * Dog model - Discriminator of RescueAnimal base model
 * @type {mongoose.Model}
 */
const Dog = RescueAnimal.discriminator('Dog', dogSchema);

module.exports = Dog;