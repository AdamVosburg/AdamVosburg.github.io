const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const vaccinationScheduleSchema = new mongoose.Schema({
  // Animal Association
  animalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RescueAnimal',
    required: true
  },

  // Vaccination Records
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

  // Schedule Tracking
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

// Method to add vaccination
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

// Method to update next due date
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

// Method to check overdue status
vaccinationScheduleSchema.methods.checkOverdueStatus = function() {
  const currentDate = new Date();
  this.overdue = this.nextDueDate && currentDate > this.nextDueDate;
};

const VaccinationSchedule = mongoose.model('VaccinationSchedule', vaccinationScheduleSchema);

module.exports = VaccinationSchedule;