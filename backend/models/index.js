/**
 * Models Index
 * @module models/index
 * @description Centralizes and exports all application models
 */

const path = require('path');
const fs = require('fs');

/**
 * Helper function to safely require models with error handling
 * @param {String} modelPath - Path to the model file
 * @param {String} modelName - Name of the model for logging
 * @returns {Object} The required model
 * @throws {Error} If model loading fails
 * @private
 */
const safeRequire = (modelPath, modelName) => {
  try {
    const model = require(modelPath);
    return model;
  } catch (error) {
    throw error;
  }
};

// Base Models
const RescueAnimal = safeRequire('./base/rescueAnimal', 'RescueAnimal');
const User = safeRequire('./user.model', 'User');

// Animal Models
const animalModels = {
  Bird: safeRequire('./animal/bird.model', 'Bird'),
  Dog: safeRequire('./animal/dog.model', 'Dog'),
  Horse: safeRequire('./animal/horse.model', 'Horse'),
  Monkey: safeRequire('./animal/monkey.model', 'Monkey')
};

// Medical Models
const medicalModels = {
  MedicalRecord: safeRequire('./medical/medicalRecord.model', 'MedicalRecord'),
  Medication: safeRequire('./medical/medication.model', 'Medication'),
  VaccinationSchedule: safeRequire('./medical/vaccinationSchedule.model', 'VaccinationSchedule')
};

// Training Models
const trainingModels = {
  Trainer: safeRequire('./training/trainer.model', 'Trainer'),
  TrainingProgram: safeRequire('./training/trainingProgram.model', 'TrainingProgram'),
  TrainingSession: safeRequire('./training/trainingSession.model', 'TrainingSession')
};

/**
 * Combined models object with all application models
 * @type {Object}
 */
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
Object.entries(models).forEach(([name, model]) => {
  if (!model) {
    throw new Error(`Model ${name} failed to load properly`);
  }
});

module.exports = models;