console.log('Starting to load vaccinationSchedule.model.js');

console.log('About to require dependencies');
const mongoose = require('mongoose');
console.log('Mongoose loaded');

const { v4: uuidv4 } = require('uuid');
console.log('uuid loaded');
console.log('All dependencies loaded');

console.log('Defining vaccinationScheduleSchema');
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
console.log('vaccinationScheduleSchema defined');

console.log('Adding schema methods');

vaccinationScheduleSchema.methods.addVaccination = function(vaccine) {
  console.log('Executing addVaccination method');
  const newVaccination = {
    type: vaccine.type,
    dateGiven: new Date(),
    nextDueDate: vaccine.nextDue
  };
  
  this.vaccinations.push(newVaccination);
  this.updateNextDueDate();
  
  return this.save();
};

vaccinationScheduleSchema.methods.updateNextDueDate = function() {
  console.log('Executing updateNextDueDate method');
  // Find the earliest next due date among all vaccinations
  const earliestNextDue = this.vaccinations.reduce((earliest, vaccination) => {
    return (!earliest || vaccination.nextDueDate < earliest) 
      ? vaccination.nextDueDate 
      : earliest;
  }, null);
  
  this.nextDueDate = earliestNextDue;
  this.checkOverdueStatus();
};

vaccinationScheduleSchema.methods.checkOverdueStatus = function() {
  console.log('Executing checkOverdueStatus method');
  const currentDate = new Date();
  this.overdue = this.nextDueDate && currentDate > this.nextDueDate;
};

console.log('Schema methods added');

console.log('Creating VaccinationSchedule model');
const VaccinationSchedule = mongoose.model('VaccinationSchedule', vaccinationScheduleSchema);
console.log('VaccinationSchedule model created');

console.log('About to export VaccinationSchedule model');
module.exports = VaccinationSchedule;
console.log('VaccinationSchedule model exported');