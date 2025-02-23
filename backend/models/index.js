console.log('Starting to load models/index.js');

const path = require('path');
const fs = require('fs');

// Helper function to safely require models
const safeRequire = (modelPath, modelName) => {
  try {
    console.log(`About to require ${modelName}`);
    const model = require(modelPath);
    console.log(`${modelName} loaded successfully`);
    return model;
  } catch (error) {
    console.error(`Error loading ${modelName}:`, error.message);
    throw error;
  }
};

// Base Models
console.log('Loading base models...');
const RescueAnimal = safeRequire('./base/rescueAnimal', 'RescueAnimal');
const User = safeRequire('./user.model', 'User');

// Animal Models
console.log('Loading animal models...');
const animalModels = {
  Bird: safeRequire('./animal/bird.model', 'Bird'),
  Dog: safeRequire('./animal/dog.model', 'Dog'),
  Horse: safeRequire('./animal/horse.model', 'Horse'),
  Monkey: safeRequire('./animal/monkey.model', 'Monkey')
};

// Medical Models
console.log('Loading medical models...');
const medicalModels = {
  MedicalRecord: safeRequire('./medical/medicalRecord.model', 'MedicalRecord'),
  Medication: safeRequire('./medical/medication.model', 'Medication'),
  VaccinationSchedule: safeRequire('./medical/vaccinationSchedule.model', 'VaccinationSchedule')
};

// Training Models
console.log('Loading training models...');
const trainingModels = {
  Trainer: safeRequire('./training/trainer.model', 'Trainer'),
  TrainingProgram: safeRequire('./training/trainingProgram.model', 'TrainingProgram'),
  TrainingSession: safeRequire('./training/trainingSession.model', 'TrainingSession')
};

// Combine all models
console.log('Combining all models for export...');
const models = {
  // Base Models
  RescueAnimal,
  User,
  
  // Animal Models
  ...animalModels,
  
  // Medical Models
  ...medicalModels,
  
  // Training Models
  ...trainingModels
};

// Verify all models are loaded
console.log('Verifying models...');
Object.entries(models).forEach(([name, model]) => {
  if (!model) {
    throw new Error(`Model ${name} failed to load properly`);
  }
});

console.log('All models verified successfully');
console.log('About to export models');
module.exports = models;
console.log('Models exported successfully');