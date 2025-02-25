/**
 * Animal Routes
 * @module routes/animal
 * @description API routes for animal management
 */

const express = require('express');
const AnimalController = require('../controllers/animal.controller.js');
const ValidationMiddleware = require('../middleware/validationMiddleware.js');

const router = express.Router();

/**
 * Create a new animal
 * @name POST /:animalType
 * @function
 * @memberof module:routes/animal
 * @param {string} animalType - Type of animal to create
 * @param {Object} req.body - Animal data
 * @returns {Object} Created animal
 */
router.post('/:animalType', 
  (req, res, next) => {
    // Dynamically select validation schema based on animal type
    const validationSchemas = {
      'dog': ValidationMiddleware.dogIntakeSchema,
      'monkey': ValidationMiddleware.monkeyIntakeSchema,
      // Add other animal types as needed
      default: ValidationMiddleware.baseAnimalIntakeSchema
    };

    const schema = validationSchemas[req.params.animalType] || validationSchemas.default;
    return ValidationMiddleware.validate(schema)(req, res, next);
  },
  AnimalController.createAnimal
);

/**
 * Get animal by ID
 * @name GET /:id
 * @function
 * @memberof module:routes/animal
 * @param {string} id - Animal ID
 * @returns {Object} Animal data
 */
router.get('/:id', AnimalController.getAnimalById);

/**
 * Update animal status
 * @name PATCH /:id/status
 * @function
 * @memberof module:routes/animal
 * @param {string} id - Animal ID
 * @param {Object} req.body - Status update data
 * @returns {Object} Updated animal
 */
router.patch('/:id/status', AnimalController.updateAnimalStatus);

/**
 * Assign trainer to animal
 * @name PATCH /:animalId/assign-trainer
 * @function
 * @memberof module:routes/animal
 * @param {string} animalId - Animal ID
 * @param {Object} req.body - Contains trainerId
 * @returns {Object} Updated animal
 */
router.patch('/:animalId/assign-trainer', AnimalController.assignTrainer);

/**
 * Get animals by type
 * @name GET /type/:animalType
 * @function
 * @memberof module:routes/animal
 * @param {string} animalType - Type of animal to filter by
 * @returns {Array} Animals of specified type
 */
router.get('/type/:animalType', AnimalController.getAnimalsByType);

module.exports = router;