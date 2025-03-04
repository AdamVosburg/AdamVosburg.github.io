/**
 * Logger Utility
 * @module utils/logger
 * @description Configures and exports a Winston logger for application-wide logging
 */

const winston = require('winston');
const path = require('path');
const fs = require('fs');

/**
 * Ensure logs directory exists
 * @type {string}
 */
const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

/**
 * Custom log format configuration
 * Includes timestamp, error stack traces, and JSON formatting
 * @type {winston.Logform.Format}
 */
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

/**
 * Winston logger instance configured with multiple transports
 * - Console output for development
 * - Error log file for errors only
 * - Combined log file for all log levels
 * - Exception and rejection handling
 * @type {winston.Logger}
 */
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports: [
    // Console transport for development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    
    // File transport for errors
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error'
    }),
    
    // File transport for combined logs
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log')
    })
  ],
  
  // Unhandled exceptions handling
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logDir, 'exceptions.log')
    })
  ],
  
  // Reject unhandled promise rejections
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logDir, 'rejections.log')
    })
  ]
});

module.exports = logger;


