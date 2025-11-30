const express = require('express');
const userImageController = require('../controllers/userImage.controller');
const { authenticate } = require('../middleware/auth');
const { upload, handleMulterError } = require('../config/multer.config');

const router = express.Router();

// All user image routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/user/upload-profile-picture
 * @desc    Upload or update user profile picture
 * @access  Private
 */
router.post(
  '/upload-profile-picture',
  upload.single('file'),
  handleMulterError,
  userImageController.uploadProfilePicture
);

/**
 * @route   DELETE /api/user/profile-picture
 * @desc    Delete user profile picture
 * @access  Private
 */
router.delete('/profile-picture', userImageController.deleteProfilePicture);

/**
 * @route   GET /api/user/profile-picture
 * @desc    Get user profile picture
 * @access  Private
 */
router.get('/profile-picture', userImageController.getProfilePicture);

module.exports = router;
