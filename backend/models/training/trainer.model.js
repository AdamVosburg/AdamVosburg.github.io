/**
 * Trainer Model
 * @module models/training/trainer
 * @description Manages trainer profiles and capabilities
 */

const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

/**
 * Trainer schema definition
 * @type {mongoose.Schema}
 */
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

/**
 * Adds a specialty to the trainer's profile
 * @param {String} specialty - The specialty to add
 * @returns {Promise<Document>|Object} Updated trainer document or unchanged trainer if specialty exists
 */
trainerSchema.methods.addSpecialty = function(specialty) {
  if (!this.specialties.includes(specialty)) {
    this.specialties.push(specialty);
    return this.save();
  }
  return this;
};

/**
 * Adds a certification to the trainer's profile
 * @param {Object} cert - Certification details
 * @param {String} cert.type - Type of certification
 * @param {Date} cert.expiryDate - Date when certification expires
 * @returns {Promise<Document>} Updated trainer document
 */
trainerSchema.methods.addCertification = function(cert) {
  const newCert = {
    certType: cert.type,
    dateEarned: new Date(),
    expiryDate: cert.expiryDate
  };
  this.certifications.push(newCert);
  return this.save();
};

/**
 * Assigns an animal to the trainer
 * @param {mongoose.Types.ObjectId} animalId - ID of the animal to assign
 * @returns {Promise<Document>} Updated trainer document
 * @throws {Error} If trainer cannot accept more animals
 */
trainerSchema.methods.assignAnimal = function(animalId) {
  if (this.canAcceptAnimal()) {
    this.assignedAnimals.push(animalId);
    return this.save();
  }
  throw new Error('Cannot accept more animals');
};

/**
 * Checks if trainer can accept another animal assignment
 * @returns {Boolean} Whether trainer can accept more animals
 */
trainerSchema.methods.canAcceptAnimal = function() {
  return this.assignedAnimals.length < this.workloadCapacity && this.activeStatus;
};

/**
 * Trainer model
 * @type {mongoose.Model}
 */
const Trainer = mongoose.model('Trainer', trainerSchema);

module.exports = Trainer;