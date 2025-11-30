const config = require('../config/env.config');
const logger = require('../utils/logger');
const ApiError = require('../utils/ApiError');

/**
 * Convert non-ApiError errors to ApiError
 */
const errorConverter = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, false, err.stack);
  }

  next(error);
};

/**
 * Central error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;

  // Log error
  if (err.isOperational) {
    logger.warn({
      statusCode,
      message,
      path: req.path,
      method: req.method,
      ip: req.ip,
    });
  } else {
    logger.error({
      statusCode,
      message,
      stack: err.stack,
      path: req.path,
      method: req.method,
      ip: req.ip,
    });
  }

  // In production, don't expose internal errors
  if (config.nodeEnv === 'production' && !err.isOperational) {
    statusCode = 500;
    message = 'Internal Server Error';
  }

  // Send error response
  const response = {
    success: false,
    error: message,
    ...(config.nodeEnv === 'development' && { stack: err.stack }),
  };

  res.status(statusCode).json(response);
};

/**
 * Handle 404 errors
 */
const notFound = (req, res, next) => {
  const error = new ApiError(404, `Route ${req.originalUrl} not found`);
  next(error);
};

module.exports = {
  errorConverter,
  errorHandler,
  notFound,
};
