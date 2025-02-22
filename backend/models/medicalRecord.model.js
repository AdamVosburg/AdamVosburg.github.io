const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const medicalRecordSchema = new mongoose.Schema({
  // Unique Identifier
  recordId: {
    type: String,
    default: uuidv4,
    unique: true,
    required: true
  },

  // Animal Association
  animalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RescueAnimal',
    required: true
  },

  // Record Details
  dateOfService: {
    type: Date,
    default: Date.now,
    required: true
  },

  recordType: {
    type: String,
    enum: ['EXAM', 'VACCINATION', 'TREATMENT', 'FOLLOWUP'],
    required: true
  },

  // Professional Information
  veterinarian: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Medical Information
  diagnosis: {
    type: String
  },

  treatment: {
    type: String
  },

  // Medication Management
  medications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medication'
  }],

  // Follow-up Details
  followUpNeeded: {
    type: Boolean,
    default: false
  },

  followUpDate: {
    type: Date
  },

  // Additional Notes
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Method to add exam record
medicalRecordSchema.methods.addExamRecord = function(examData) {
  this.recordType = 'EXAM';
  this.diagnosis = examData.diagnosis;
  this.treatment = examData.treatment;
  
  if (examData.followUp) {
    this.followUpNeeded = true;
    this.followUpDate = new Date(examData.followUpDate);
  }
  
  return this.save();
};

// Method to add vaccination record
medicalRecordSchema.methods.addVaccination = function(vaccinationData) {
  this.recordType = 'VACCINATION';
  this.treatment = vaccinationData.vacType;
  this.followUpNeeded = true;
  this.followUpDate = new Date(vaccinationData.nextDate);
  
  return this.save();
};

// Method to add medication
medicalRecordSchema.methods.addMedication = function(medicationId) {
  if (!this.medications.includes(medicationId)) {
    this.medications.push(medicationId);
  }
  return this.save();
};

// Method to update follow-up status
medicalRecordSchema.methods.updateFollowUpStatus = function() {
  if (this.followUpNeeded) {
    const currentDate = new Date();
    if (currentDate >= this.followUpDate) {
      this.scheduleFollowUp();
    }
  }
  return this;
};

// Method to schedule follow-up
medicalRecordSchema.methods.scheduleFollowUp = function() {
  // Placeholder for follow-up scheduling logic
  // In a real-world scenario, this might create a new medical record or notification
  console.log(`Follow-up scheduled for record ${this.recordId}`);
  return this;
};

// Method to generate medical report
medicalRecordSchema.methods.generateMedicalReport = function() {
  return {
    recordId: this.recordId,
    dateOfService: this.dateOfService,
    recordType: this.recordType,
    diagnosis: this.diagnosis,
    treatment: this.treatment,
    medications: this.medications,
    followUpNeeded: this.followUpNeeded,
    followUpDate: this.followUpDate,
    notes: this.notes
  };
};

const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);

module.exports = MedicalRecord;