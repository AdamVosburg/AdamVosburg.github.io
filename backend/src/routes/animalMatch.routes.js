/**
 * Animal Matching Routes
 * @module routes/animalMatch
 * @description API routes for animal matching algorithms
 */

const express = require('express');
const AnimalMatchController = require('../controllers/animalMatch.controller.js');
const ValidationMiddleware = require('../middleware/validationMiddleware.js');
const { authMiddleware } = require('../middleware/auth.middleware.js');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

/**
 * Find best animal matches
 * @name POST /best-matches
 * @function
 * @memberof module:routes/animalMatch
 * @param {Object} req.body - Matching criteria
 * @returns {Array} Matched animals with scores
 */
router.post('/best-matches', 
  ValidationMiddleware.validate(ValidationMiddleware.matchingCriteriaSchema),
  AnimalMatchController.findBestMatches
);

/**
 * Match animals for service
 * @name POST /service-matches
 * @function
 * @memberof module:routes/animalMatch
 * @param {Object} req.body - Service requirements
 * @returns {Array} Matched service animals with scores
 */
router.post('/service-matches',
  ValidationMiddleware.validate(ValidationMiddleware.serviceRequirementsSchema),
  AnimalMatchController.matchForService
);

/**
 * Find matches using priority queue
 * @name POST /priority-matches
 * @function
 * @memberof module:routes/animalMatch
 * @param {Object} req.body - Criteria and priority attributes
 * @returns {Array} Matched animals in priority order
 */
router.post('/priority-matches',
  ValidationMiddleware.validate(ValidationMiddleware.priorityMatchingSchema),
  AnimalMatchController.findMatchesWithPriorityQueue
);

module.exports = router;