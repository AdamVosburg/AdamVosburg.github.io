console.log('Starting to load rescueAnimal.js');

console.log('About to require mongoose');
let mongoose;
try {
  mongoose = require('mongoose');
  console.log('Mongoose loaded successfully');
} catch (error) {
  console.error('Error loading mongoose:', error.message);
  console.error('Error stack:', error.stack);
}

console.log('About to require uuid');
let uuidv4;
try {
  const { v4: uuidv4Temp } = require('uuid');
  uuidv4 = uuidv4Temp;
  console.log('uuid loaded successfully');
} catch (error) {
  console.error('Error loading uuid:', error.message);
  console.error('Error stack:', error.stack);
}

console.log('Defining rescueAnimalSchema');
const rescueAnimalSchema = new mongoose.Schema({
  // ... (schema definition remains the same)
});
console.log('rescueAnimalSchema defined');

console.log('Defining schema methods');
rescueAnimalSchema.methods.isAvailableForService = function() {
  console.log('Executing isAvailableForService method');
  return this.trainingStatus === 'Ready' && !this.reserved;
};

rescueAnimalSchema.methods.needsMedicalCheck = function() {
  console.log('Executing needsMedicalCheck method');
  return this.medicalRecords.length === 0;
};

rescueAnimalSchema.methods.addMedicalRecord = function(record) {
  console.log('Executing addMedicalRecord method');
  this.medicalRecords.push(record);
  return this.save();
};

rescueAnimalSchema.methods.addTrainingProgram = function(program) {
  console.log('Executing addTrainingProgram method');
  this.trainingPrograms.push(program);
  return this.save();
};

rescueAnimalSchema.methods.addSpecialNeed = function(need) {
  console.log('Executing addSpecialNeed method');
  this.specialNeeds.push(need);
  return this.save();
};

rescueAnimalSchema.methods.updateTrainingStatus = function(status) {
  console.log('Executing updateTrainingStatus method');
  this.trainingStatus = status;
  return this.save();
};

rescueAnimalSchema.methods.setReservationStatus = function(isReserved) {
  console.log('Executing setReservationStatus method');
  this.reserved = isReserved;
  return this.save();
};

rescueAnimalSchema.methods.assignTrainer = function(trainerId) {
  console.log('Executing assignTrainer method');
  this.assignedTrainer = trainerId;
  return this.save();
};
console.log('Schema methods defined');

console.log('Creating RescueAnimal model');
const RescueAnimal = mongoose.model('RescueAnimal', rescueAnimalSchema);
console.log('RescueAnimal model created');

console.log('About to export RescueAnimal model');
module.exports = RescueAnimal;
console.log('RescueAnimal model exported');