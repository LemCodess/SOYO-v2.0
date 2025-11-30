const Story = require('../models/storyModel');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

/**
 * Create a new story
 */
const createStory = async (userId, storyData) => {
  try {
    const story = await Story.create({
      userId,
      ...storyData,
    });

    logger.info(`Story created by user ${userId}: ${story._id}`);

    return story;
  } catch (error) {
    logger.error(`Story creation error: ${error.message}`);
    throw new ApiError(400, error.message);
  }
};

/**
 * Update an existing story
 */
const updateStory = async (storyId, userId, storyData) => {
  try {
    const story = await Story.findOne({ _id: storyId, userId });

    if (!story) {
      throw new ApiError(404, 'Story not found or unauthorized');
    }

    Object.assign(story, storyData);
    await story.save();

    logger.info(`Story updated: ${storyId}`);

    return story;
  } catch (error) {
    logger.error(`Story update error: ${error.message}`);
    throw error instanceof ApiError ? error : new ApiError(400, error.message);
  }
};

/**
 * Get published stories with search
 */
const getPublishedStories = async (searchQuery = '') => {
  try {
    let query = { status: 'published' };

    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, 'i');
      query = {
        status: 'published',
        $or: [
          { topicName: searchRegex },
          { category: searchRegex },
          { tags: searchRegex },
        ],
      };
    }

    const stories = await Story.find(query)
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .lean();

    // Filter by author name if search query exists
    let filteredStories = stories;
    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, 'i');
      filteredStories = stories.filter(
        story => story.userId?.name && story.userId.name.match(searchRegex)
      );
    }

    return filteredStories;
  } catch (error) {
    logger.error(`Get published stories error: ${error.message}`);
    throw new ApiError(500, 'Failed to fetch stories');
  }
};

/**
 * Get user's draft stories
 */
const getUserDrafts = async (userId) => {
  try {
    const drafts = await Story.find({ userId, status: 'draft' })
      .sort({ updatedAt: -1 })
      .lean();

    return drafts;
  } catch (error) {
    logger.error(`Get drafts error: ${error.message}`);
    throw new ApiError(500, 'Failed to fetch drafts');
  }
};

/**
 * Get story by ID
 */
const getStoryById = async (storyId) => {
  try {
    const story = await Story.findById(storyId)
      .populate('userId', 'name')
      .lean();

    if (!story) {
      throw new ApiError(404, 'Story not found');
    }

    return story;
  } catch (error) {
    logger.error(`Get story error: ${error.message}`);
    throw error instanceof ApiError ? error : new ApiError(500, 'Failed to fetch story');
  }
};

/**
 * Delete a story (only drafts)
 */
const deleteStory = async (storyId, userId) => {
  try {
    const story = await Story.findOne({ _id: storyId, userId, status: 'draft' });

    if (!story) {
      throw new ApiError(404, 'Draft not found or cannot delete published story');
    }

    await story.deleteOne();

    logger.info(`Story deleted: ${storyId}`);

    return { message: 'Draft deleted successfully' };
  } catch (error) {
    logger.error(`Delete story error: ${error.message}`);
    throw error instanceof ApiError ? error : new ApiError(500, 'Failed to delete draft');
  }
};

module.exports = {
  createStory,
  updateStory,
  getPublishedStories,
  getUserDrafts,
  getStoryById,
  deleteStory,
};
