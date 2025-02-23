console.log('Starting application...');

const express = require('express');
console.log('Express loaded');

const cors = require('cors');
console.log('CORS loaded');

const dotenv = require('dotenv');
console.log('dotenv loaded');

const logger = require('./config/logger');
console.log('Logger loaded');

const connectDB = require('./config/database');
console.log('Database connection module loaded');

const routes = require('./routes');
console.log('Routes loaded');

const errorHandler = require('./middleware/errorHandler');
console.log('Error handler loaded');

const ApiError = require('./utils/apiError');
console.log('ApiError loaded');

console.log('All modules loaded successfully');

// Load environment variables
dotenv.config();
console.log('Environment variables loaded');

// Create Express app
const app = express();
console.log('Express app created');

// Connect to MongoDB
console.log('Attempting to connect to MongoDB...');
connectDB();

console.log('MongoDB connection attempt completed');

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
console.log('CORS middleware set up');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
console.log('JSON and URL-encoded middleware set up');

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});
console.log('Logging middleware set up');

// API Routes
app.use('/api/v1', routes);
console.log('API routes set up');

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to Grazios Rescue System API',
    status: 'Operational'
  });
});
console.log('Basic route set up');

// 404 handler for undefined routes
app.use((req, res, next) => {
  next(ApiError.notFound(`Route ${req.originalUrl} not found`));
});
console.log('404 handler set up');

// Error handling middleware
app.use(errorHandler);
console.log('Error handling middleware set up');

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

console.log('Server start attempted');

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  logger.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`Uncaught Exception: ${err.message}`);
  logger.error(`Uncaught Exception: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app;
console.log('App module exported');