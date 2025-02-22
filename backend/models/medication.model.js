const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const medicationSchema = new mongoose.Schema({
  // Unique Identifier
  medicationId: {
    type: String,
    default: uuidv4,
    unique: true,
    required: true
  },

  // Medication Details
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

// Method to check medication status
medicationSchema.methods.checkMedicationStatus = function() {
  const currentDate = new Date();
  
  if (currentDate > this.endDate) {
    this.active = false;
  }
  
  return this.active;
};

// Method to extend medication
medicationSchema.methods.extendMedication = function(newEndDate) {
  if (new Date(newEndDate) > new Date()) {
    this.endDate = newEndDate;
    this.active = true;
    return this.save();
  }
  
  throw new Error('Invalid end date');
};

const Medication = mongoose.model('Medication', medicationSchema);

module.exports = Medication;