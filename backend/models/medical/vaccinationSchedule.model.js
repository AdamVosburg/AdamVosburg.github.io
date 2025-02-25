/**
 * Vaccination Schedule Model
 * @module models/medical/vaccinationSchedule
 * @description Manages vaccination schedules for rescue animals
 */

const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

/**
 * Vaccination Schedule schema definition
 * @type {mongoose.Schema}
 */
const vaccinationScheduleSchema = new mongoose.Schema({
  animalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RescueAnimal',
    required: true
  },
  vaccinations: [{
    type: {
      type: String,
      required: true
    },
    dateGiven: {
      type: Date,
      default: Date.now
    },
    nextDueDate: {
      type: Date,
      required: true
    }
  }],
  nextDueDate: {
    type: Date
  },
  overdue: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

/**
 * Adds a new vaccination to the schedule
 * @param {Object} vaccine - Vaccination details
 * @param {String} vaccine.type - Type of vaccination
 * @param {Date} vaccine.nextDue - Date when next vaccination is due
 * @returns {Promise<Document>} Updated vaccination schedule
 */
vaccinationScheduleSchema.methods.addVaccination = function(vaccine) {
  const newVaccination = {
    type: vaccine.type,
    dateGiven: new Date(),
    nextDueDate: vaccine.nextDue
  };
  
  this.vaccinations.push(newVaccination);
  this.updateNextDueDate();
  
  return this.save();
};

/**
 * Updates the next due date based on the earliest upcoming vaccination
 * Sets the primary nextDueDate field based on the earliest upcoming vaccination
 */
vaccinationScheduleSchema.methods.updateNextDueDate = function() {
  // Find the earliest next due date among all vaccinations
  const earliestNextDue = this.vaccinations.reduce((earliest, vaccination) => {
    return (!earliest || vaccination.nextDueDate < earliest) 
      ? vaccination.nextDueDate 
      : earliest;
  }, null);
  
  this.nextDueDate = earliestNextDue;
  this.checkOverdueStatus();
};

/**
 * Checks if any vaccinations are overdue based on current date
 * Updates the overdue field accordingly
 */
vaccinationScheduleSchema.methods.checkOverdueStatus = function() {
  const currentDate = new Date();
  this.overdue = this.nextDueDate && currentDate > this.nextDueDate;
};

/**
 * VaccinationSchedule model
 * @type {mongoose.Model}
 */
const VaccinationSchedule = mongoose.model('VaccinationSchedule', vaccinationScheduleSchema);

module.exports = VaccinationSchedule;