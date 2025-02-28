/**
 * Animal Matching Service
 * @module services/animalMatch
 * @description Provides advanced algorithms for matching animals to adopters, service needs, or trainers
 */

const RescueAnimal = require('../../models/base/rescueAnimal.js');
const Dog = require('../../models/animal/dog.model.js');
const Monkey = require('../../models/animal/monkey.model.js');
const Bird = require('../../models/animal/bird.model.js');
const Horse = require('../../models/animal/horse.model.js');
const ApiError = require('../utils/apiError.js');
const logger = require('../config/logger.js');

/**
 * Service class for animal matching operations
 * @class AnimalMatchService
 */
class AnimalMatchService {
  /**
   * Find best animal matches based on criteria
   * @static
   * @async
   * @param {Object} criteria - Matching criteria
   * @param {string} criteria.animalType - Type of animal to match
   * @param {Object} criteria.attributes - Desired attributes for matching
   * @param {Object} criteria.weights - Importance weights for each attribute
   * @param {number} [limit=5] - Maximum number of matches to return
   * @returns {Promise<Array<Object>>} Array of matched animals with scores
   * @throws {ApiError} If criteria are invalid or matching fails
   */
  static async findBestMatches(criteria, limit = 5) {
    try {
      const { animalType, attributes, weights } = criteria;
      
      // Validate input
      if (!animalType || !attributes) {
        throw ApiError.badRequest('Missing required matching criteria');
      }
      
      // Select appropriate model based on animal type
      const capitalizedType = animalType.charAt(0).toUpperCase() + animalType.slice(1);
      const Model = {
        'Dog': Dog,
        'Monkey': Monkey,
        'Bird': Bird,
        'Horse': Horse
      }[capitalizedType];
      
      if (!Model) {
        throw ApiError.badRequest('Invalid animal type');
      }
      
      // Get all animals of the specified type
      const animals = await Model.find({ adoptable: true, reserved: false });
      
      if (animals.length === 0) {
        return [];
      }
      
      // Apply the matching algorithm
      const scoredAnimals = this._scoreAnimals(animals, attributes, weights || {});
      
      // Sort by score (descending) and limit results
      return scoredAnimals
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, limit);
    } catch (error) {
      logger.error(`Animal matching error: ${error.message}`);
      throw error instanceof ApiError 
        ? error 
        : ApiError.internalServer('Failed to find animal matches');
    }
  }
  
  /**
   * Match animals based on service requirements
   * @static
   * @async
   * @param {Object} serviceRequirements - Service requirements for matching
   * @param {string} serviceRequirements.serviceType - Type of service needed
   * @param {Object} serviceRequirements.clientNeeds - Specific client needs
   * @param {number} [limit=5] - Maximum number of matches to return
   * @returns {Promise<Array<Object>>} Array of matched animals with scores
   * @throws {ApiError} If requirements are invalid or matching fails
   */
  static async matchForService(serviceRequirements, limit = 5) {
    try {
      const { serviceType, clientNeeds } = serviceRequirements;
      
      if (!serviceType) {
        throw ApiError.badRequest('Service type is required');
      }
      
      // Define criteria based on service type
      let criteria = { adoptable: false, reserved: false, trainingStatus: 'Ready' };
      let matchingModel;
      
      switch (serviceType.toUpperCase()) {
        case 'SERVICE':
        case 'THERAPY':
        case 'SEARCH':
          matchingModel = Dog;
          criteria.serviceType = serviceType.toUpperCase();
          break;
          
        case 'EQUINE_THERAPY':
          matchingModel = Horse;
          criteria.trainingSpecialization = 'Therapy';
          break;
          
        default:
          throw ApiError.badRequest('Unsupported service type');
      }
      
      // Find animals that meet the base criteria
      const eligibleAnimals = await matchingModel.find(criteria);
      
      if (eligibleAnimals.length === 0) {
        return [];
      }
      
      // Apply specialized scoring based on client needs
      const scoredAnimals = this._applyServiceScoring(eligibleAnimals, serviceType, clientNeeds);
      
      // Sort by score (descending) and limit results
      return scoredAnimals
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, limit);
    } catch (error) {
      logger.error(`Service matching error: ${error.message}`);
      throw error instanceof ApiError 
        ? error 
        : ApiError.internalServer('Failed to find service animal matches');
    }
  }
  
  /**
   * Find matches using a priority queue algorithm
   * @static
   * @async
   * @param {Object} criteria - Matching criteria
   * @param {Array<string>} priorityAttributes - Attributes in priority order
   * @param {number} [limit=5] - Maximum number of matches to return
   * @returns {Promise<Array<Object>>} Array of matched animals in priority order
   * @throws {ApiError} If criteria are invalid or matching fails
   */
  static async findMatchesWithPriorityQueue(criteria, priorityAttributes, limit = 5) {
    try {
      const { animalType, attributes } = criteria;
      
      // Validate input
      if (!animalType || !attributes || !priorityAttributes || !Array.isArray(priorityAttributes)) {
        throw ApiError.badRequest('Invalid priority matching criteria');
      }
      
      // Select appropriate model based on animal type
      const capitalizedType = animalType.charAt(0).toUpperCase() + animalType.slice(1);
      const Model = {
        'Dog': Dog,
        'Monkey': Monkey,
        'Bird': Bird,
        'Horse': Horse
      }[capitalizedType];
      
      if (!Model) {
        throw ApiError.badRequest('Invalid animal type');
      }
      
      // Get all animals of the specified type
      const animals = await Model.find({ adoptable: true, reserved: false });
      
      if (animals.length === 0) {
        return [];
      }
      
      // Create priority queue for matching
      const priorityQueue = new PriorityQueue();
      
      // Process each animal
      for (const animal of animals) {
        let priority = 0;
        
        // Calculate priority score based on attribute order
        for (let i = 0; i < priorityAttributes.length; i++) {
          const attr = priorityAttributes[i];
          const weight = priorityAttributes.length - i; // Higher weight for earlier attributes
          
          if (this._matchesAttributeCriteria(animal, attr, attributes[attr])) {
            priority += weight;
          }
        }
        
        // Add to priority queue
        priorityQueue.enqueue({
          animal: animal,
          score: priority
        });
      }
      
      // Extract top matches
      const matches = [];
      for (let i = 0; i < limit && !priorityQueue.isEmpty(); i++) {
        const match = priorityQueue.dequeue();
        matches.push({
          animal: match.animal,
          matchScore: match.score
        });
      }
      
      return matches;
    } catch (error) {
      logger.error(`Priority queue matching error: ${error.message}`);
      throw error instanceof ApiError 
        ? error 
        : ApiError.internalServer('Failed to find matches using priority queue');
    }
  }
  
  /**
   * Scores animals based on matching criteria and weights
   * @private
   * @static
   * @param {Array<Document>} animals - Array of animal documents
   * @param {Object} attributes - Desired attributes for matching
   * @param {Object} weights - Importance weights for each attribute
   * @returns {Array<Object>} Array of animals with match scores
   */
  static _scoreAnimals(animals, attributes, weights) {
    return animals.map(animal => {
      let totalScore = 0;
      let maxPossibleScore = 0;
      
      // Process each attribute in the criteria
      for (const [attr, desiredValue] of Object.entries(attributes)) {
        if (animal[attr] !== undefined) {
          const weight = weights[attr] || 1;
          maxPossibleScore += weight;
          
          // Score based on attribute type
          if (typeof animal[attr] === 'boolean') {
            // Boolean attributes
            if (animal[attr] === desiredValue) {
              totalScore += weight;
            }
          } else if (typeof animal[attr] === 'number') {
            // Numeric attributes (calculate similarity)
            const similarity = 1 - Math.abs(animal[attr] - desiredValue) / 10;
            totalScore += similarity * weight;
          } else if (Array.isArray(animal[attr])) {
            // Array attributes (check for inclusion)
            if (Array.isArray(desiredValue)) {
              // Calculate overlap
              const overlap = desiredValue.filter(v => animal[attr].includes(v)).length;
              const similarity = overlap / Math.max(desiredValue.length, 1);
              totalScore += similarity * weight;
            } else {
              // Single value in array
              if (animal[attr].includes(desiredValue)) {
                totalScore += weight;
              }
            }
          } else {
            // String or other attributes (exact match)
            if (animal[attr] === desiredValue) {
              totalScore += weight;
            }
          }
        }
      }
      
      // Normalize score (0-100)
      const normalizedScore = maxPossibleScore > 0 
        ? (totalScore / maxPossibleScore) * 100 
        : 0;
      
      return {
        animal: animal,
        matchScore: parseFloat(normalizedScore.toFixed(2))
      };
    });
  }
  
  /**
   * Applies specialized scoring for service animals
   * @private
   * @static
   * @param {Array<Document>} animals - Array of eligible service animals
   * @param {string} serviceType - Type of service
   * @param {Object} clientNeeds - Client-specific needs
   * @returns {Array<Object>} Array of animals with service match scores
   */
  static _applyServiceScoring(animals, serviceType, clientNeeds) {
    return animals.map(animal => {
      let score = 70; // Base score for meeting eligibility
      
      // Apply service-specific scoring
      switch (serviceType.toUpperCase()) {
        case 'SERVICE':
          // Score based on dog-specific attributes
          if (animal.obedienceLevel) {
            score += animal.obedienceLevel * 4; // Up to 20 points for obedience
          }
          
          // Check specializations
          if (clientNeeds.specializations && animal.specializations) {
            const matchingSpecs = clientNeeds.specializations.filter(
              spec => animal.specializations.includes(spec)
            ).length;
            
            score += matchingSpecs * 5; // 5 points per matching specialization
          }
          break;
          
        case 'THERAPY':
          // Score therapy dogs
          if (animal.temperament) {
            score += animal.temperament * 5; // Up to 25 points for temperament
          }
          break;
          
        case 'EQUINE_THERAPY':
          // Horse therapy scoring
          if (animal.assessTherapySuitability) {
            const assessment = animal.assessTherapySuitability();
            score += assessment.score * 5; // Up to 25 points
          }
          
          if (clientNeeds.riderWeight && animal.maxRiderWeight) {
            // Ensure weight safety
            if (animal.maxRiderWeight < clientNeeds.riderWeight) {
              score = 0; // Disqualify if weight limit exceeded
            }
          }
          break;
      }
      
      return {
        animal: animal,
        matchScore: Math.min(100, score) // Cap at 100
      };
    });
  }
  
  /**
   * Checks if an animal matches a specific attribute criterion
   * @private
   * @static
   * @param {Document} animal - Animal document
   * @param {string} attribute - Attribute to check
   * @param {*} criteria - Desired value for the attribute
   * @returns {boolean} Whether the animal matches the criterion
   */
  static _matchesAttributeCriteria(animal, attribute, criteria) {
    // Handle undefined attribute
    if (animal[attribute] === undefined) {
      return false;
    }
    
    // Match based on attribute type
    if (typeof animal[attribute] === 'boolean') {
      return animal[attribute] === criteria;
    } else if (typeof animal[attribute] === 'number') {
      // For numeric values, consider approximate matches
      return Math.abs(animal[attribute] - criteria) <= 1;
    } else if (Array.isArray(animal[attribute])) {
      // For arrays, check if criteria is contained
      return Array.isArray(criteria) 
        ? criteria.some(c => animal[attribute].includes(c))
        : animal[attribute].includes(criteria);
    } else {
      // String or other types
      return animal[attribute] === criteria;
    }
  }
}

/**
 * Priority Queue implementation for animal matching
 * @class PriorityQueue
 */
class PriorityQueue {
  /**
   * Create a new priority queue
   * @constructor
   */
  constructor() {
    this.items = [];
  }
  
  /**
   * Add an item to the priority queue
   * @param {Object} item - Item to add
   * @param {Document} item.animal - Animal document
   * @param {number} item.score - Priority score
   */
  enqueue(item) {
    // Find position based on priority (score)
    let added = false;
    for (let i = 0; i < this.items.length; i++) {
      if (item.score > this.items[i].score) {
        this.items.splice(i, 0, item);
        added = true;
        break;
      }
    }
    
    // If not added, add to the end
    if (!added) {
      this.items.push(item);
    }
  }
  
  /**
   * Remove and return the highest priority item
   * @returns {Object} Highest priority item
   */
  dequeue() {
    if (this.isEmpty()) {
      return null;
    }
    return this.items.shift();
  }
  
  /**
   * Check if the queue is empty
   * @returns {boolean} Whether the queue is empty
   */
  isEmpty() {
    return this.items.length === 0;
  }
  
  /**
   * Get the current size of the queue
   * @returns {number} Queue size
   */
  size() {
    return this.items.length;
  }
}

module.exports = AnimalMatchService;