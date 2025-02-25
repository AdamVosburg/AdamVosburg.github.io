/**
 * Medical Record Model
 * @module models/medical/medicalRecord
 * @description Manages medical records for rescue animals
 */

const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

/**
 * Medical Record schema definition
 * @type {mongoose.Schema}
 */
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

/**
 * Adds examination data to the medical record
 * @param {Object} examData - Data from the examination
 * @param {String} examData.diagnosis - Diagnosis from examination
 * @param {String} examData.treatment - Treatment plan
 * @param {Boolean} [examData.followUp] - Whether follow-up is needed
 * @param {Date} [examData.followUpDate] - Date for follow-up appointment
 * @returns {Promise<Document>} Updated medical record
 */
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

/**
 * Adds vaccination data to the medical record
 * @param {Object} vaccinationData - Vaccination details
 * @param {String} vaccinationData.vacType - Type of vaccination
 * @param {Date} vaccinationData.nextDate - Date for next vaccination
 * @returns {Promise<Document>} Updated medical record
 */
medicalRecordSchema.methods.addVaccination = function(vaccinationData) {
  this.recordType = 'VACCINATION';
  this.treatment = vaccinationData.vacType;
  this.followUpNeeded = true;
  this.followUpDate = new Date(vaccinationData.nextDate);
  
  return this.save();
};

/**
 * Adds a medication to the medical record
 * @param {mongoose.Types.ObjectId} medicationId - ID of the medication
 * @returns {Promise<Document>} Updated medical record
 */
medicalRecordSchema.methods.addMedication = function(medicationId) {
  if (!this.medications.includes(medicationId)) {
    this.medications.push(medicationId);
  }
  return this.save();
};

/**
 * MedicalRecord model
 * @type {mongoose.Model}
 */
const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);

module.exports = MedicalRecord;