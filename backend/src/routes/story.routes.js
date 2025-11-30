const express = require('express');
const storyController = require('../controllers/story.controller');
const { authenticate } = require('../middleware/auth');
const {
  storyValidation,
  storyIdValidation,
  searchValidation,
} = require('../validators/story.validator');

const router = express.Router();

// All story routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/stories
 * @desc    Create or update a story
 * @access  Private
 */
router.post('/', storyValidation, storyController.createOrUpdateStory);

/**
 * @route   GET /api/stories/published
 * @desc    Get all published stories with optional search
 * @access  Private
 */
router.get('/published', searchValidation, storyController.getPublishedStories);

/**
 * @route   GET /api/stories/drafts
 * @desc    Get user's draft stories
 * @access  Private
 */
router.get('/drafts', storyController.getUserDrafts);

/**
 * @route   GET /api/stories/:id
 * @desc    Get story by ID
 * @access  Private
 */
router.get('/:id', storyIdValidation, storyController.getStoryById);

/**
 * @route   DELETE /api/stories/:id
 * @desc    Delete a draft story
 * @access  Private
 */
router.delete('/:id', storyIdValidation, storyController.deleteStory);

module.exports = router;
