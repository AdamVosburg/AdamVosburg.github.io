console.log('Starting to load bird.model.js');

console.log('About to require dependencies');
const mongoose = require('mongoose');
console.log('Mongoose loaded');

const RescueAnimal = require('../base/rescueAnimal');
console.log('RescueAnimal model loaded');

const TrainingProgram = require('../training/trainingProgram.model');
console.log('TrainingProgram model loaded');

const MedicalRecord = require('../medical/medicalRecord.model');
console.log('MedicalRecord model loaded');
console.log('All dependencies loaded');

console.log('Defining birdSchema');
const birdSchema = new mongoose.Schema({
  // Schema definition stays the same
});
console.log('birdSchema defined');

console.log('Adding schema methods');
// Add all your existing methods here with logging
birdSchema.methods.initializeBirdEnvironment = function() {
  console.log('Executing initializeBirdEnvironment method');
  // Method implementation stays the same
};

// Add debug logs to other methods similarly
console.log('Schema methods added');

console.log('Creating Bird model discriminator');
const Bird = RescueAnimal.discriminator('Bird', birdSchema);
console.log('Bird model discriminator created');

console.log('About to export Bird model');
module.exports = Bird;
console.log('Bird model exported');