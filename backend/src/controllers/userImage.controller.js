const userImageService = require('../services/userImage.service');
const ApiError = require('../utils/ApiError');

/**
 * @route   POST /api/user/upload-profile-picture
 * @desc    Upload or update user profile picture
 * @access  Private
 */
const uploadProfilePicture = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new ApiError(400, 'No file uploaded');
    }

    const userId = req.user._id;
    const filename = req.file.filename;

    const result = await userImageService.uploadProfilePicture(userId, filename);

    res.status(200).json({
      success: true,
      message: 'Profile picture uploaded successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/user/profile-picture
 * @desc    Delete user profile picture
 * @access  Private
 */
const deleteProfilePicture = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const result = await userImageService.deleteProfilePicture(userId);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/user/profile-picture
 * @desc    Get user profile picture
 * @access  Private
 */
const getProfilePicture = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const result = await userImageService.getProfilePicture(userId);

    if (!result) {
      return res.status(200).json({
        success: true,
        data: null,
        message: 'No profile picture found',
      });
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadProfilePicture,
  deleteProfilePicture,
  getProfilePicture,
};
