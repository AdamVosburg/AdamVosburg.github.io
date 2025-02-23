console.log('Starting to load trainer.model.js');

console.log('About to require mongoose');
const mongoose = require('mongoose');
console.log('Mongoose loaded successfully');

console.log('About to require uuid');
const { v4: uuidv4 } = require('uuid');
console.log('uuid loaded successfully');

console.log('Defining trainerSchema');
const trainerSchema = new mongoose.Schema({
  trainerId: {
    type: String,
    default: uuidv4,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  specialties: [{
    type: String
  }],
  certifications: [{
    certType: String,
    dateEarned: Date,
    expiryDate: Date
  }],
  assignedAnimals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RescueAnimal'
  }],
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
console.log('trainerSchema defined');

console.log('Defining schema methods');
trainerSchema.methods.addSpecialty = function(specialty) {
  if (!this.specialties.includes(specialty)) {
    this.specialties.push(specialty);
    return this.save();
  }
  return this;
};

trainerSchema.methods.addCertification = function(cert) {
  const newCert = {
    certType: cert.type,
    dateEarned: new Date(),
    expiryDate: cert.expiryDate
  };
  this.certifications.push(newCert);
  return this.save();
};

trainerSchema.methods.assignAnimal = function(animalId) {
  if (this.canAcceptAnimal()) {
    this.assignedAnimals.push(animalId);
    return this.save();
  }
  throw new Error('Cannot accept more animals');
};

trainerSchema.methods.canAcceptAnimal = function() {
  return this.assignedAnimals.length < this.workloadCapacity && this.activeStatus;
};
console.log('Schema methods defined');

console.log('Creating Trainer model');
const Trainer = mongoose.model('Trainer', trainerSchema);
console.log('Trainer model created');

console.log('About to export Trainer model');
module.exports = Trainer;
console.log('Trainer model exported');