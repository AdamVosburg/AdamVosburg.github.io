const Joi = require('joi');
const ApiError = require('../utils/apiError');
const logger = require('../config/logger'); // Ensure you have a logger setup

class ValidationMiddleware {
  // Generic validation middleware with debugging logs
  static validate(schema) {
    return (req, res, next) => {
      logger.info('Validation middleware triggered');
      logger.debug(`Request body: ${JSON.stringify(req.body)}`);
      
      const { error } = schema.validate(req.body, { 
        abortEarly: false, 
        allowUnknown: true 
      });

      if (error) {
        const errorMessage = error.details.map(detail => detail.message).join(', ');
        logger.error(`Validation error: ${errorMessage}`);
        return next(ApiError.badRequest(errorMessage));
      }

      logger.info('Validation passed');
      next();
    };
  }

  static baseAnimalIntakeSchema = Joi.object({
    name: Joi.string().trim().required(),
    gender: Joi.string().valid('Male', 'Female', 'Unknown').required(),
    age: Joi.string().required(),
    weight: Joi.string().required(),
    acquisitionDate: Joi.date().max('now').required(),
    acquisitionLocation: Joi.string().required()
  });

  static dogIntakeSchema = this.baseAnimalIntakeSchema.keys({
    breed: Joi.string().required(),
    serviceType: Joi.string().valid('SERVICE', 'THERAPY', 'SEARCH').required(),
    obedienceLevel: Joi.number().min(1).max(5).required()
  });

  static monkeyIntakeSchema = this.baseAnimalIntakeSchema.keys({
    species: Joi.string().valid('Capuchin', 'Guenon', 'Macaque', 'Marmoset', 'Squirrel', 'Tamarin').required(),
    tailLength: Joi.number().required(),
    height: Joi.number().required(),
    bodyLength: Joi.number().required(),
    dexterityLevel: Joi.number().min(1).max(10).required(),
    toolUseCapability: Joi.boolean().required()
  });
}

logger.info('ValidationMiddleware successfully loaded');
module.exports = ValidationMiddleware;
