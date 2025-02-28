/**
 * API Routes Index
 * @module routes
 * @description Centralized router that mounts all application routes
 */

const express = require('express');
const animalRoutes = require('./animal.routes.js');
const authRoutes = require('./auth.routes.js');
const trainerRoutes = require('./trainer.routes.js');
const trainingProgramRoutes = require('./trainingProgram.routes');
const medicalRecordRoutes = require('./medicalRecord.routes.js');
const reportRoutes = require('./report.routes.js');
const animalMatchRoutes = require('./animalMatch.routes.js');

const router = express.Router();

/**
 * Mount routes
 * @name API Routes
 * @description All API routes are mounted with their base paths
 */

// Animal routes - handles animal CRUD operations
router.use('/animals', animalRoutes);

// Animal matching routes - handles advanced animal matching algorithms
router.use('/animal-matches', animalMatchRoutes);

// Authentication routes - handles user auth and registration
router.use('/auth', authRoutes);

// Trainer routes - handles trainer management
router.use('/trainers', trainerRoutes);

// Training program routes - handles training programs and sessions
router.use('/training-programs', trainingProgramRoutes);

// Medical record routes - handles medical records and medications
router.use('/medical-records', medicalRecordRoutes);

// Report routes - handles report generation and export
router.use('/reports', reportRoutes);

module.exports = router;