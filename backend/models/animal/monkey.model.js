console.log('Starting to load monkey.model.js');

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

console.log('Defining monkeySchema');
const monkeySchema = new mongoose.Schema({
  species: {
    type: String,
    enum: ['Capuchin', 'Guenon', 'Macaque', 'Marmoset', 'Squirrel', 'Tamarin'],
    required: true
  },
  tailLength: {
    type: Number,
    required: true
  },
  height: {
    type: Number,
    required: true
  },
  bodyLength: {
    type: Number,
    required: true
  },
  dexterityLevel: {
    type: Number,
    min: 1,
    max: 10,
    required: true
  },
  toolUseCapability: {
    type: Boolean,
    required: true
  },
  environmentalNeeds: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  cognitiveTasks: [{
    type: String
  }]
});
console.log('monkeySchema defined');

console.log('Adding schema methods');

monkeySchema.methods.initializeEnvironmentalNeeds = function() {
  console.log('Executing initializeEnvironmentalNeeds method');
  const environmentalNeedsMap = {
    'Capuchin': {
      habitat: 'Tropical forest enclosure',
      temperature: '22-28°C',
      humidity: '60-80%',
      enrichmentActivities: ['Puzzle feeders', 'Climbing structures']
    },
    // ... other species maps
  };

  this.environmentalNeeds = environmentalNeedsMap[this.species] || {};
  return this.save();
};

monkeySchema.methods.initializeMedicalRecord = async function() {
  console.log('Executing initializeMedicalRecord method');
  try {
    const medicalRecord = new MedicalRecord({
      animalId: this._id,
      veterinarian: null,
      recordType: 'EXAM',
      diagnosis: 'Initial primate health assessment',
      notes: `Specific to ${this.species} species`
    });

    await medicalRecord.save();
    console.log('Medical record created successfully');
    
    this.medicalRecords.push(medicalRecord._id);
    return this.save();
  } catch (error) {
    console.error('Error initializing medical record:', error);
    throw error;
  }
};

monkeySchema.methods.initializeTrainingProgram = async function(trainer) {
  console.log('Executing initializeTrainingProgram method');
  try {
    const trainingProgram = new TrainingProgram({
      animalId: this._id,
      type: 'Cognitive Enrichment',
      trainer: trainer._id,
      status: 'Scheduled'
    });

    await trainingProgram.save();
    console.log('Training program created successfully');
    
    this.trainingPrograms.push(trainingProgram._id);
    this.trainingStatus = 'In Training';
    
    return this.save();
  } catch (error) {
    console.error('Error initializing training program:', error);
    throw error;
  }
};

// Add debug logs to other methods similarly
console.log('Schema methods added');

console.log('Creating Monkey model discriminator');
const Monkey = RescueAnimal.discriminator('Monkey', monkeySchema);
console.log('Monkey model discriminator created');

console.log('About to export Monkey model');
module.exports = Monkey;
console.log('Monkey model exported');