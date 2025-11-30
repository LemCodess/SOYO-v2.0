const storyService = require('../services/story.service');

/**
 * @route   POST /api/stories
 * @desc    Create or update a story
 * @access  Private
 */
const createOrUpdateStory = async (req, res, next) => {
  try {
    const { _id, ...storyData } = req.body;
    const userId = req.user._id;

    let result;
    let message;

    if (_id) {
      // Update existing story
      result = await storyService.updateStory(_id, userId, storyData);
      message = 'Story updated successfully';
    } else {
      // Create new story
      result = await storyService.createStory(userId, storyData);
      message = 'Story created successfully';
    }

    res.status(_id ? 200 : 201).json({
      success: true,
      message,
      data: { story: result },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/stories/published
 * @desc    Get all published stories with optional search
 * @access  Private
 */
const getPublishedStories = async (req, res, next) => {
  try {
    const { searchQuery } = req.query;

    const stories = await storyService.getPublishedStories(searchQuery);

    res.status(200).json({
      success: true,
      count: stories.length,
      data: stories,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/stories/drafts
 * @desc    Get user's draft stories
 * @access  Private
 */
const getUserDrafts = async (req, res, next) => {
  try {
    const drafts = await storyService.getUserDrafts(req.user._id);

    res.status(200).json({
      success: true,
      count: drafts.length,
      data: drafts,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/stories/:id
 * @desc    Get story by ID
 * @access  Private
 */
const getStoryById = async (req, res, next) => {
  try {
    const story = await storyService.getStoryById(req.params.id);

    res.status(200).json({
      success: true,
      data: story,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/stories/:id
 * @desc    Delete a draft story
 * @access  Private
 */
const deleteStory = async (req, res, next) => {
  try {
    const result = await storyService.deleteStory(req.params.id, req.user._id);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrUpdateStory,
  getPublishedStories,
  getUserDrafts,
  getStoryById,
  deleteStory,
};
