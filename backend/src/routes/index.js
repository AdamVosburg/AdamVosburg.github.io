const express = require('express');
const animalRoutes = require('./animal.routes');
const authRoutes = require('./auth.routes');
const trainerRoutes = require('./trainer.routes');
const trainingProgramRoutes = require('./trainingProgram.routes');
const medicalRecordRoutes = require('./medicalRecord.routes');
const reportRoutes = require('./report.routes');

const router = express.Router();

// Mount routes
router.use('/animals', animalRoutes);
router.use('/auth', authRoutes);
router.use('/trainers', trainerRoutes);
router.use('/training-programs', trainingProgramRoutes);
router.use('/medical-records', medicalRecordRoutes);
router.use('/reports', reportRoutes);

// Additional routes can be added here

module.exports = router;