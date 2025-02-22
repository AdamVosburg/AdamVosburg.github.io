const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// Base Rescue Animal Schema
const rescueAnimalSchema = new mongoose.Schema({
  // Unique Identifier
  id: {
    type: String,
    default: uuidv4,
    unique: true,
    required: true
  },

  // Basic Information
  name: {
    type: String,
    required: true,
    trim: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Unknown'],
    required: true
  },
  age: {
    type: String,
    required: true
  },
  weight: {
    type: String,
    required: true
  },

  // Acquisition Details
  acquisitionDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  acquisitionLocation: {
    type: String,
    required: true
  },

  // Training and Service Status
  trainingStatus: {
    type: String,
    enum: ['Intake', 'In Training', 'Ready', 'Retired'],
    default: 'Intake'
  },
  reserved: {
    type: Boolean,
    default: false
  },
  inServiceCountry: {
    type: String,
    default: ''
  },

  // Nested References
  medicalRecords: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MedicalRecord'
  }],
  trainingPrograms: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TrainingProgram'
  }],
  specialNeeds: [{
    type: String
  }],
  
  // Trainer Assignment
  assignedTrainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trainer'
  }
}, {
  timestamps: true,
  discriminatorKey: 'animalType'
});

// Method to check availability for service
rescueAnimalSchema.methods.isAvailableForService = function() {
  return this.trainingStatus === 'Ready' && !this.reserved;
};

// Method to check if medical check is needed
rescueAnimalSchema.methods.needsMedicalCheck = function() {
  // Placeholder for more complex medical check logic
  // Could be expanded to check last medical record date, etc.
  return this.medicalRecords.length === 0;
};

// Method to add medical record
rescueAnimalSchema.methods.addMedicalRecord = function(record) {
  this.medicalRecords.push(record);
  return this.save();
};

// Method to add training program
rescueAnimalSchema.methods.addTrainingProgram = function(program) {
  this.trainingPrograms.push(program);
  return this.save();
};

// Method to add special need
rescueAnimalSchema.methods.addSpecialNeed = function(need) {
  this.specialNeeds.push(need);
  return this.save();
};

// Method to update training status
rescueAnimalSchema.methods.updateTrainingStatus = function(status) {
  this.trainingStatus = status;
  return this.save();
};

// Method to set reservation status
rescueAnimalSchema.methods.setReservationStatus = function(isReserved) {
  this.reserved = isReserved;
  return this.save();
};

// Method to assign trainer
rescueAnimalSchema.methods.assignTrainer = function(trainerId) {
  this.assignedTrainer = trainerId;
  return this.save();
};

// Create the base model
const RescueAnimal = mongoose.model('RescueAnimal', rescueAnimalSchema);

module.exports = RescueAnimal;