const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const trainerSchema = new mongoose.Schema({
  // Unique Identifier
  trainerId: {
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

  // Professional Details
  specialties: [{
    type: String
  }],

  certifications: [{
    type: {
      certType: String,
      dateEarned: Date,
      expiryDate: Date
    }
  }],

  // Work Assignment Details
  assignedAnimals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RescueAnimal'
  }],

  // Schedule and Capacity
  schedule: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },

  workloadCapacity: {
    type: Number,
    default: 5,
    min: 0,
    max: 10
  },

  // Status and Performance
  activeStatus: {
    type: Boolean,
    default: true
  },

  workHours: {
    type: String
  },

  contactInfo: {
    type: String
  },

  performanceMetrics: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Method to add a specialty
trainerSchema.methods.addSpecialty = function(specialty) {
  if (!this.specialties.includes(specialty)) {
    this.specialties.push(specialty);
    return this.save();
  }
  return this;
};

// Method to add a certification
trainerSchema.methods.addCertification = function(cert) {
  const newCert = {
    certType: cert.type,
    dateEarned: new Date(),
    expiryDate: cert.expiryDate
  };
  
  this.certifications.push(newCert);
  return this.save();
};

// Method to assign an animal
trainerSchema.methods.assignAnimal = function(animalId) {
  if (this.canAcceptAnimal()) {
    this.assignedAnimals.push(animalId);
    return this.save();
  }
  throw new Error('Cannot accept more animals');
};

// Method to check if trainer can accept an animal
trainerSchema.methods.canAcceptAnimal = function() {
  return this.assignedAnimals.length < this.workloadCapacity && this.activeStatus;
};

// Method to update performance metrics
trainerSchema.methods.updatePerformanceMetrics = function(metrics) {
  this.performanceMetrics = {
    ...this.performanceMetrics,
    ...metrics
  };
  return this.save();
};

// Method to update work hours
trainerSchema.methods.updateWorkHours = function(hours) {
  this.workHours = hours;
  return this.save();
};

const Trainer = mongoose.model('Trainer', trainerSchema);

module.exports = Trainer;