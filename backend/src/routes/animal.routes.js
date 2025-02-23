console.log('Starting to load animal.routes.js');

const express = require('express');
console.log('Express loaded in animal.routes.js');

console.log('About to require animal.controller');
const AnimalController = require('../controllers/animal.controller');
console.log('AnimalController loaded');

console.log('About to require validationMiddleware');
const ValidationMiddleware = require('../middleware/validationMiddleware');
console.log('ValidationMiddleware loaded');

const router = express.Router();
console.log('Router created in animal.routes.js');

// Route for creating a new animal
console.log('Setting up POST route');
router.post('/:animalType', 
  (req, res, next) => {
    console.log('In POST route middleware');
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
console.log('POST route set up');

// Route for getting animal by ID
console.log('Setting up GET route for animal by ID');
router.get('/:id', AnimalController.getAnimalById);
console.log('GET route for animal by ID set up');

// Route for updating animal status
console.log('Setting up PATCH route for updating animal status');
router.patch('/:id/status', AnimalController.updateAnimalStatus);
console.log('PATCH route for updating animal status set up');

// Route for assigning trainer
console.log('Setting up PATCH route for assigning trainer');
router.patch('/:animalId/assign-trainer', AnimalController.assignTrainer);
console.log('PATCH route for assigning trainer set up');

// Route for getting animals by type
console.log('Setting up GET route for animals by type');
router.get('/type/:animalType', AnimalController.getAnimalsByType);
console.log('GET route for animals by type set up');

console.log('About to export router from animal.routes.js');
module.exports = router;
console.log('Router exported from animal.routes.js');