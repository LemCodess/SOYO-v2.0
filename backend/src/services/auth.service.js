const User = require('../models/userModel');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

/**
 * Register a new user
 */
const registerUser = async (name, email, password) => {
  try {
    const user = await User.signup(name, email, password);
    const { accessToken, refreshToken } = await user.generateTokens();

    logger.info(`New user registered: ${email}`);

    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
      accessToken,
      refreshToken,
    };
  } catch (error) {
    logger.error(`Registration error for ${email}: ${error.message}`);
    throw new ApiError(400, error.message);
  }
};

/**
 * Login user
 */
const loginUser = async (email, password) => {
  try {
    const user = await User.login(email, password);
    const { accessToken, refreshToken } = await user.generateTokens();

    logger.info(`User logged in: ${email}`);

    return {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
      accessToken,
      refreshToken,
    };
  } catch (error) {
    logger.warn(`Login attempt failed for ${email}: ${error.message}`);
    throw new ApiError(401, error.message);
  }
};

/**
 * Refresh access token
 */
const refreshAccessToken = async (refreshToken) => {
  try {
    const { verifyRefreshToken } = require('../middleware/auth');
    const user = await verifyRefreshToken(refreshToken);

    const newAccessToken = user.generateAccessToken();

    logger.info(`Access token refreshed for user: ${user.email}`);

    return { accessToken: newAccessToken };
  } catch (error) {
    logger.warn(`Token refresh failed: ${error.message}`);
    throw error;
  }
};

/**
 * Logout user (clear refresh token)
 */
const logoutUser = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    user.refreshToken = null;
    await user.save();

    logger.info(`User logged out: ${user.email}`);

    return { message: 'Logged out successfully' };
  } catch (error) {
    logger.error(`Logout error: ${error.message}`);
    throw error;
  }
};

/**
 * Get user profile
 */
const getUserProfile = async (userId) => {
  try {
    const user = await User.findById(userId).select('-password -refreshToken');

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    return user;
  } catch (error) {
    logger.error(`Get profile error: ${error.message}`);
    throw error;
  }
};

module.exports = {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  getUserProfile,
};
