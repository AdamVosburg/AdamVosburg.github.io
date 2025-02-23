console.log('Starting to load routes/index.js');

const express = require('express');
console.log('Express loaded in routes/index.js');

console.log('About to require animal.routes');
const animalRoutes = require('./animal.routes');
console.log('animal.routes loaded successfully');

console.log('About to require auth.routes');
const authRoutes = require('./auth.routes');
console.log('auth.routes loaded successfully');

console.log('About to require trainer.routes');
const trainerRoutes = require('./trainer.routes');
console.log('trainer.routes loaded successfully');

console.log('About to require trainingProgram.routes');
const trainingProgramRoutes = require('./trainingProgram.routes');
console.log('trainingProgram.routes loaded successfully');

console.log('About to require medicalRecord.routes');
const medicalRecordRoutes = require('./medicalRecord.routes');
console.log('medicalRecord.routes loaded successfully');

console.log('About to require report.routes');
const reportRoutes = require('./report.routes');
console.log('report.routes loaded successfully');

console.log('All route files loaded successfully');

const router = express.Router();
console.log('Express router created');

// Mount routes
console.log('Mounting routes');
router.use('/animals', animalRoutes);
router.use('/auth', authRoutes);
router.use('/trainers', trainerRoutes);
router.use('/training-programs', trainingProgramRoutes);
router.use('/medical-records', medicalRecordRoutes);
router.use('/reports', reportRoutes);
console.log('All routes mounted successfully');

// Additional routes can be added here

console.log('About to export router');
module.exports = router;
console.log('Router exported successfully');