const jwt = require('jsonwebtoken');
const config = require('../config/env.config');
const ApiError = require('../utils/ApiError');
const User = require('../models/userModel');
const logger = require('../utils/logger');

/**
 * Verify JWT access token and attach user to request
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Authentication required. Please provide a valid token.');
    }

    const token = authHeader.split(' ')[1];

    try {
      // Verify token
      const decoded = jwt.verify(token, config.jwtSecret);

      // Fetch user (exclude password and refresh token)
      const user = await User.findById(decoded._id).select('-password -refreshToken');

      if (!user) {
        throw new ApiError(401, 'User not found. Token may be invalid.');
      }

      // Attach user to request
      req.user = user;
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new ApiError(401, 'Access token expired. Please refresh your token.');
      }
      if (error.name === 'JsonWebTokenError') {
        throw new ApiError(401, 'Invalid token. Please login again.');
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Optional authentication - doesn't throw error if no token
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];

      try {
        const decoded = jwt.verify(token, config.jwtSecret);
        const user = await User.findById(decoded._id).select('-password -refreshToken');

        if (user) {
          req.user = user;
        }
      } catch (error) {
        logger.debug('Optional auth failed:', error.message);
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Verify refresh token
 */
const verifyRefreshToken = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, config.jwtRefreshSecret);
    const user = await User.findById(decoded._id);

    if (!user || user.refreshToken !== refreshToken) {
      throw new ApiError(401, 'Invalid refresh token');
    }

    return user;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new ApiError(401, 'Refresh token expired. Please login again.');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new ApiError(401, 'Invalid refresh token. Please login again.');
    }
    throw error;
  }
};

module.exports = {
  authenticate,
  optionalAuth,
  verifyRefreshToken,
};
