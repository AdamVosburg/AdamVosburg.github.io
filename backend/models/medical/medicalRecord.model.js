console.log('Starting to load medicalRecord.model.js');

console.log('About to require mongoose');
const mongoose = require('mongoose');
console.log('Mongoose loaded successfully');

console.log('About to require uuid');
const { v4: uuidv4 } = require('uuid');
console.log('uuid loaded successfully');

console.log('Defining medicalRecordSchema');
const medicalRecordSchema = new mongoose.Schema({
  recordId: {
    type: String,
    default: uuidv4,
    unique: true,
    required: true
  },
  animalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RescueAnimal',
    required: true
  },
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
  veterinarian: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  diagnosis: {
    type: String
  },
  treatment: {
    type: String
  },
  medications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medication'
  }],
  followUpNeeded: {
    type: Boolean,
    default: false
  },
  followUpDate: {
    type: Date
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});
console.log('medicalRecordSchema defined');

console.log('Defining schema methods');
medicalRecordSchema.methods.addExamRecord = function(examData) {
  console.log('Executing addExamRecord method');
  this.recordType = 'EXAM';
  this.diagnosis = examData.diagnosis;
  this.treatment = examData.treatment;
  
  if (examData.followUp) {
    this.followUpNeeded = true;
    this.followUpDate = new Date(examData.followUpDate);
  }
  
  return this.save();
};

medicalRecordSchema.methods.addVaccination = function(vaccinationData) {
  console.log('Executing addVaccination method');
  this.recordType = 'VACCINATION';
  this.treatment = vaccinationData.vacType;
  this.followUpNeeded = true;
  this.followUpDate = new Date(vaccinationData.nextDate);
  
  return this.save();
};

medicalRecordSchema.methods.addMedication = function(medicationId) {
  console.log('Executing addMedication method');
  if (!this.medications.includes(medicationId)) {
    this.medications.push(medicationId);
  }
  return this.save();
};
console.log('Schema methods defined');

console.log('Creating MedicalRecord model');
const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);
console.log('MedicalRecord model created');

console.log('About to export MedicalRecord model');
module.exports = MedicalRecord;
console.log('MedicalRecord model exported');