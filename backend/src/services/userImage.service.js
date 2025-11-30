const fs = require('fs').promises;
const path = require('path');
const UserImage = require('../models/userImageModel');
const User = require('../models/userModel');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');
const config = require('../config/env.config');

/**
 * Upload or update user profile picture
 * - Deletes old image file if exists
 * - Updates/creates UserImage record
 * - Updates User.image field
 */
const uploadProfilePicture = async (userId, filename) => {
  try {
    // Check if user already has a profile picture
    const existingImage = await UserImage.findOne({ userId });

    // Delete old image file if exists
    if (existingImage && existingImage.image) {
      const oldImagePath = path.join(config.uploadDir, existingImage.image);
      try {
        await fs.unlink(oldImagePath);
        logger.info(`Deleted old profile picture: ${existingImage.image}`);
      } catch (error) {
        // If file doesn't exist, just log and continue
        logger.warn(`Could not delete old image file: ${error.message}`);
      }
    }

    // Update or create UserImage record
    const userImage = await UserImage.findOneAndUpdate(
      { userId },
      { image: filename },
      { new: true, upsert: true, runValidators: true }
    );

    // Update User.image field
    await User.findByIdAndUpdate(userId, { image: filename });

    logger.info(`Profile picture uploaded for user ${userId}: ${filename}`);

    return {
      success: true,
      image: filename,
      imageUrl: `/uploads/images/${filename}`,
    };
  } catch (error) {
    // If upload fails, delete the uploaded file
    const uploadedFilePath = path.join(config.uploadDir, filename);
    try {
      await fs.unlink(uploadedFilePath);
    } catch (unlinkError) {
      logger.error(`Failed to delete uploaded file after error: ${unlinkError.message}`);
    }

    logger.error(`Profile picture upload error: ${error.message}`);
    throw new ApiError(500, 'Failed to upload profile picture');
  }
};

/**
 * Delete user profile picture
 * - Deletes image file
 * - Removes UserImage record
 * - Clears User.image field
 */
const deleteProfilePicture = async (userId) => {
  try {
    const userImage = await UserImage.findOne({ userId });

    if (!userImage) {
      throw new ApiError(404, 'Profile picture not found');
    }

    // Delete file from filesystem
    const imagePath = path.join(config.uploadDir, userImage.image);
    try {
      await fs.unlink(imagePath);
      logger.info(`Deleted profile picture file: ${userImage.image}`);
    } catch (error) {
      logger.warn(`Could not delete image file: ${error.message}`);
    }

    // Remove UserImage record
    await UserImage.findOneAndDelete({ userId });

    // Clear User.image field
    await User.findByIdAndUpdate(userId, { image: null });

    logger.info(`Profile picture deleted for user ${userId}`);

    return {
      success: true,
      message: 'Profile picture deleted successfully',
    };
  } catch (error) {
    logger.error(`Profile picture deletion error: ${error.message}`);
    throw error instanceof ApiError ? error : new ApiError(500, 'Failed to delete profile picture');
  }
};

/**
 * Get user profile picture
 */
const getProfilePicture = async (userId) => {
  try {
    const userImage = await UserImage.findOne({ userId });

    if (!userImage) {
      return null;
    }

    return {
      image: userImage.image,
      imageUrl: `/uploads/images/${userImage.image}`,
    };
  } catch (error) {
    logger.error(`Get profile picture error: ${error.message}`);
    throw new ApiError(500, 'Failed to fetch profile picture');
  }
};

module.exports = {
  uploadProfilePicture,
  deleteProfilePicture,
  getProfilePicture,
};
