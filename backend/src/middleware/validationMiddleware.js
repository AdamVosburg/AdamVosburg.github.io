/**
 * Validation Middleware
 * @module middleware/validation
 * @description Provides request validation using Joi schemas
 */

const Joi = require('joi');
const ApiError = require('../utils/apiError.js');
const logger = require('../config/logger.js');

/**
 * Middleware class for request validation
 * @class ValidationMiddleware
 */
class ValidationMiddleware {
  /**
   * Creates a validation middleware using the provided schema
   * @static
   * @param {Joi.Schema} schema - Joi validation schema
   * @returns {Function} Express middleware function
   * @throws {ApiError} If validation fails
   */
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
}

/**
 * Base validation schema for animal intake
 * @type {Joi.ObjectSchema}
 */
ValidationMiddleware.baseAnimalIntakeSchema = Joi.object({
  name: Joi.string().trim().required(),
  gender: Joi.string().valid('Male', 'Female', 'Unknown').required(),
  age: Joi.string().required(),
  weight: Joi.string().required(),
  acquisitionDate: Joi.date().max('now').required(),
  acquisitionLocation: Joi.string().required()
});

/**
 * Validation schema for dog intake
 * @type {Joi.ObjectSchema}
 */
ValidationMiddleware.dogIntakeSchema = ValidationMiddleware.baseAnimalIntakeSchema.keys({
  breed: Joi.string().required(),
  serviceType: Joi.string().valid('SERVICE', 'THERAPY', 'SEARCH').required(),
  obedienceLevel: Joi.number().min(1).max(5).required()
});

/**
 * Validation schema for monkey intake
 * @type {Joi.ObjectSchema}
 */
ValidationMiddleware.monkeyIntakeSchema = ValidationMiddleware.baseAnimalIntakeSchema.keys({
  species: Joi.string().valid('Capuchin', 'Guenon', 'Macaque', 'Marmoset', 'Squirrel', 'Tamarin').required(),
  tailLength: Joi.number().required(),
  height: Joi.number().required(),
  bodyLength: Joi.number().required(),
  dexterityLevel: Joi.number().min(1).max(10).required(),
  toolUseCapability: Joi.boolean().required()
});

module.exports = ValidationMiddleware;