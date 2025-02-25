/**
 * Base RescueAnimal Model - Parent model for all animal types
 * @module models/base/rescueAnimal
 */

const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

/**
 * RescueAnimal schema definition - base schema for all animal types
 * @type {mongoose.Schema}
 */
const rescueAnimalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  species: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true,
    min: 0
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Unknown'],
    required: true
  },
  weight: {
    type: Number,
    required: true,
    min: 0
  },
  color: {
    type: String,
    required: true
  },
  microchipId: {
    type: String,
    default: () => uuidv4()
  },
  intakeDate: {
    type: Date,
    default: Date.now
  },
  intakeReason: {
    type: String,
    required: true
  },
  medicalHistory: {
    type: String,
    default: ''
  },
  temperament: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },
  trainingStatus: {
    type: String,
    enum: ['Not Started', 'In Training', 'Ready', 'Requires Review'],
    default: 'Not Started'
  },
  specialNeeds: [{
    type: String
  }],
  adoptable: {
    type: Boolean,
    default: false
  },
  reserved: {
    type: Boolean,
    default: false
  },
  assignedTrainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trainer',
    default: null
  },
  medicalRecords: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MedicalRecord'
  }],
  trainingPrograms: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TrainingProgram'
  }],
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true,
  discriminatorKey: 'animalType'
});

/**
 * Checks if animal is available for service assignment
 * @returns {Boolean} Whether the animal is available for service
 */
rescueAnimalSchema.methods.isAvailableForService = function() {
  return this.trainingStatus === 'Ready' && !this.reserved;
};

/**
 * Checks if animal needs a medical examination
 * @returns {Boolean} Whether the animal needs a medical check
 */
rescueAnimalSchema.methods.needsMedicalCheck = function() {
  return this.medicalRecords.length === 0;
};

/**
 * Adds a new medical record to the animal
 * @param {Object} record - The medical record object or id
 * @returns {Promise<Document>} Updated animal document
 */
rescueAnimalSchema.methods.addMedicalRecord = function(record) {
  this.medicalRecords.push(record);
  return this.save();
};

/**
 * Adds a new training program to the animal
 * @param {Object} program - The training program object or id
 * @returns {Promise<Document>} Updated animal document
 */
rescueAnimalSchema.methods.addTrainingProgram = function(program) {
  this.trainingPrograms.push(program);
  return this.save();
};

/**
 * Adds a special need to the animal's record
 * @param {String} need - The special need description
 * @returns {Promise<Document>} Updated animal document
 */
rescueAnimalSchema.methods.addSpecialNeed = function(need) {
  this.specialNeeds.push(need);
  return this.save();
};

/**
 * Updates the animal's training status
 * @param {String} status - New training status
 * @returns {Promise<Document>} Updated animal document
 */
rescueAnimalSchema.methods.updateTrainingStatus = function(status) {
  this.trainingStatus = status;
  return this.save();
};

/**
 * Sets the animal's reservation status
 * @param {Boolean} isReserved - Whether the animal is reserved
 * @returns {Promise<Document>} Updated animal document
 */
rescueAnimalSchema.methods.setReservationStatus = function(isReserved) {
  this.reserved = isReserved;
  return this.save();
};

/**
 * Assigns a trainer to the animal
 * @param {ObjectId} trainerId - The id of the trainer
 * @returns {Promise<Document>} Updated animal document
 */
rescueAnimalSchema.methods.assignTrainer = function(trainerId) {
  this.assignedTrainer = trainerId;
  return this.save();
};

/**
 * RescueAnimal model - Base model for all animal types
 * @type {mongoose.Model}
 */
const RescueAnimal = mongoose.model('RescueAnimal', rescueAnimalSchema);

module.exports = RescueAnimal;