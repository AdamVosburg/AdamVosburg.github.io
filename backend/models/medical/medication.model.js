/**
 * Medication Model
 * @module models/medical/medication
 * @description Manages medication records for rescue animals
 */

const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

/**
 * Medication schema definition
 * @type {mongoose.Schema}
 */
const medicationSchema = new mongoose.Schema({
  medicationId: {
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
  dosage: {
    type: String,
    required: true
  },
  frequency: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  prescribingVet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  specialInstructions: {
    type: String
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

/**
 * Checks if medication is active based on current date vs. end date
 * @returns {Boolean} Whether the medication is active
 */
medicationSchema.methods.checkMedicationStatus = function() {
  const currentDate = new Date();
  
  if (currentDate > this.endDate) {
    this.active = false;
  }
  
  return this.active;
};

/**
 * Extends the medication end date
 * @param {Date|String} newEndDate - New end date for the medication
 * @returns {Promise<Document>} Updated medication document
 * @throws {Error} If the new end date is invalid (in the past)
 */
medicationSchema.methods.extendMedication = function(newEndDate) {
  try {
    if (new Date(newEndDate) > new Date()) {
      this.endDate = newEndDate;
      this.active = true;
      return this.save();
    }
    
    throw new Error('Invalid end date');
  } catch (error) {
    throw error;
  }
};

/**
 * Medication model
 * @type {mongoose.Model}
 */
const Medication = mongoose.model('Medication', medicationSchema);

module.exports = Medication;