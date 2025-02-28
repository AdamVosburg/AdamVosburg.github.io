/**
 * Animal Matching Controller
 * @module controllers/animalMatch
 * @description Handles HTTP requests related to animal matching
 */

const AnimalMatchService = require('../services/animalMatch.service.js');
const catchAsync = require('../utils/catchAsync.js');
const ApiError = require('../utils/apiError.js');

/**
 * Controller class for animal matching operations
 * @class AnimalMatchController
 */
class AnimalMatchController {
  /**
   * Find best animal matches based on criteria
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.body - Request body
   * @param {string} req.body.animalType - Type of animal to match
   * @param {Object} req.body.attributes - Desired attributes for matching
   * @param {Object} [req.body.weights] - Importance weights for each attribute
   * @param {number} [req.query.limit] - Maximum number of matches to return
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with matched animals
   */
  static findBestMatches = catchAsync(async (req, res) => {
    const criteria = req.body;
    const limit = req.query.limit ? parseInt(req.query.limit) : 5;
    
    const matches = await AnimalMatchService.findBestMatches(criteria, limit);
    
    res.status(200).json({
      status: 'success',
      results: matches.length,
      data: matches
    });
  });
  
  /**
   * Match animals for service requirements
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.body - Request body
   * @param {string} req.body.serviceType - Type of service needed
   * @param {Object} req.body.clientNeeds - Specific client needs
   * @param {number} [req.query.limit] - Maximum number of matches to return
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with matched service animals
   */
  static matchForService = catchAsync(async (req, res) => {
    const serviceRequirements = req.body;
    const limit = req.query.limit ? parseInt(req.query.limit) : 5;
    
    const matches = await AnimalMatchService.matchForService(serviceRequirements, limit);
    
    res.status(200).json({
      status: 'success',
      results: matches.length,
      data: matches
    });
  });
  
  /**
   * Find matches using priority queue algorithm
   * @static
   * @async
   * @param {Object} req - Express request object
   * @param {Object} req.body - Request body
   * @param {string} req.body.animalType - Type of animal to match
   * @param {Object} req.body.attributes - Desired attributes for matching
   * @param {Array<string>} req.body.priorityAttributes - Attributes in priority order
   * @param {number} [req.query.limit] - Maximum number of matches to return
   * @param {Object} res - Express response object
   * @returns {Object} JSON response with matched animals in priority order
   */
  static findMatchesWithPriorityQueue = catchAsync(async (req, res) => {
    const { criteria, priorityAttributes } = req.body;
    const limit = req.query.limit ? parseInt(req.query.limit) : 5;
    
    const matches = await AnimalMatchService.findMatchesWithPriorityQueue(
      criteria, 
      priorityAttributes, 
      limit
    );
    
    res.status(200).json({
      status: 'success',
      results: matches.length,
      data: matches
    });
  });
}

module.exports = AnimalMatchController;