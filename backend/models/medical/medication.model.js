console.log('Starting to load medication.model.js');

console.log('About to require dependencies');
const mongoose = require('mongoose');
console.log('Mongoose loaded');

const { v4: uuidv4 } = require('uuid');
console.log('uuid loaded');
console.log('All dependencies loaded');

console.log('Defining medicationSchema');
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
console.log('medicationSchema defined');

console.log('Adding schema methods');

medicationSchema.methods.checkMedicationStatus = function() {
  console.log('Executing checkMedicationStatus method');
  const currentDate = new Date();
  
  if (currentDate > this.endDate) {
    this.active = false;
    console.log('Medication marked as inactive due to end date');
  }
  
  return this.active;
};

medicationSchema.methods.extendMedication = function(newEndDate) {
  console.log('Executing extendMedication method');
  try {
    if (new Date(newEndDate) > new Date()) {
      console.log(`Extending medication end date to: ${newEndDate}`);
      this.endDate = newEndDate;
      this.active = true;
      return this.save();
    }
    
    console.error('Invalid end date provided');
    throw new Error('Invalid end date');
  } catch (error) {
    console.error('Error extending medication:', error.message);
    throw error;
  }
};

console.log('Schema methods added');

console.log('Creating Medication model');
const Medication = mongoose.model('Medication', medicationSchema);
console.log('Medication model created');

console.log('About to export Medication model');
module.exports = Medication;
console.log('Medication model exported');