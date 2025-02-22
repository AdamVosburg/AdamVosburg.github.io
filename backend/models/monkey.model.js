const mongoose = require('mongoose');
const RescueAnimal = require('./base/rescueAnimal');
const TrainingProgram = require('./trainingProgram.model');
const MedicalRecord = require('./medicalRecord.model');

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

// Initialize environmental needs
monkeySchema.methods.initializeEnvironmentalNeeds = function() {
  const environmentalNeedsMap = {
    'Capuchin': {
      habitat: 'Tropical forest enclosure',
      temperature: '22-28°C',
      humidity: '60-80%',
      enrichmentActivities: ['Puzzle feeders', 'Climbing structures']
    },
    'Guenon': {
      habitat: 'Mixed forest simulation',
      temperature: '20-26°C',
      humidity: '50-70%',
      enrichmentActivities: ['Social interaction', 'Foraging challenges']
    },
    'Macaque': {
      habitat: 'Complex social enclosure',
      temperature: '18-25°C',
      humidity: '40-60%',
      enrichmentActivities: ['Group dynamics', 'Tool use training']
    },
    'Marmoset': {
      habitat: 'Vertical space with branches',
      temperature: '22-30°C',
      humidity: '70-90%',
      enrichmentActivities: ['Pair bonding', 'Scent marking']
    },
    'Squirrel': {
      habitat: 'Arboreal environment',
      temperature: '20-28°C',
      humidity: '50-75%',
      enrichmentActivities: ['Tree-like structures', 'Nut hiding']
    },
    'Tamarin': {
      habitat: 'Dense vegetation enclosure',
      temperature: '24-32°C',
      humidity: '80-95%',
      enrichmentActivities: ['Group cooperation', 'Vertical exploration']
    }
  };

  this.environmentalNeeds = environmentalNeedsMap[this.species] || {};
  return this.save();
};

// Initialize cognitive tasks
monkeySchema.methods.initializeCognitiveTasks = function() {
  const cognitiveTasks = [
    'Object permanence assessment',
    'Tool use evaluation',
    'Social learning observation',
    'Problem-solving challenges',
    'Memory and recall tests'
  ];

  this.cognitiveTasks = cognitiveTasks;
  return this.save();
};

// Initialize medical record
monkeySchema.methods.initializeMedicalRecord = async function() {
  try {
    const medicalRecord = new MedicalRecord({
      animalId: this._id,
      veterinarian: null,
      recordType: 'EXAM',
      diagnosis: 'Initial primate health assessment',
      notes: `Specific to ${this.species} species`
    });

    await medicalRecord.save();
    
    this.medicalRecords.push(medicalRecord._id);
    return this.save();
  } catch (error) {
    console.error('Error initializing medical record:', error);
    throw error;
  }
};

// Initialize training program
monkeySchema.methods.initializeTrainingProgram = async function(trainer) {
  try {
    const trainingProgram = new TrainingProgram({
      animalId: this._id,
      type: 'Cognitive Enrichment',
      trainer: trainer._id,
      status: 'Scheduled'
    });

    await trainingProgram.save();
    
    this.trainingPrograms.push(trainingProgram._id);
    this.trainingStatus = 'In Training';
    
    return this.save();
  } catch (error) {
    console.error('Error initializing training program:', error);
    throw error;
  }
};

// Assess dexterity and tool use
monkeySchema.methods.assessDexterityAndToolUse = function() {
  return {
    species: this.species,
    dexterityLevel: this.dexterityLevel,
    toolUseCapability: this.toolUseCapability,
    potentialTasks: this.getPotentialTasks()
  };
};

// Get potential tasks based on species and dexterity
monkeySchema.methods.getPotentialTasks = function() {
  const dexterityBasedTasks = {
    low: ['Simple object manipulation', 'Basic foraging'],
    medium: ['Tool selection', 'Sequence learning'],
    high: ['Complex tool use', 'Problem-solving']
  };

  const dexterityCategory = 
    this.dexterityLevel <= 3 ? 'low' :
    this.dexterityLevel <= 7 ? 'medium' : 'high';

  return {
    dexterityCategory,
    potentialTasks: dexterityBasedTasks[dexterityCategory]
  };
};

// Create the Monkey model as a discriminator
const Monkey = RescueAnimal.discriminator('Monkey', monkeySchema);

module.exports = Monkey;