const express = require('express');
const AnimalController = require('../controllers/animal.controller');
const ValidationMiddleware = require('../middleware/validationMiddleware');

const router = express.Router();

// Route for creating a new animal
router.post('/:animalType', 
  (req, res, next) => {
    // Dynamically select validation schema based on animal type
    const validationSchemas = {
      'dog': ValidationMiddleware.dogIntakeSchema,
      'monkey': ValidationMiddleware.monkeyIntakeSchema,
      // Add other animal types
      default: ValidationMiddleware.baseAnimalIntakeSchema
    };

    const schema = validationSchemas[req.params.animalType] || validationSchemas.default;
    ValidationMiddleware.validate(schema)(req, res, next);
  },
  AnimalController.createAnimal
);

// Route for getting animal by ID
router.get('/:id', AnimalController.getAnimalById);

// Route for updating animal status
router.patch('/:id/status', AnimalController.updateAnimalStatus);

// Route for assigning trainer
router.patch('/:animalId/assign-trainer', AnimalController.assignTrainer);

// Route for getting animals by type
router.get('/type/:animalType', AnimalController.getAnimalsByType);

module.exports = router;