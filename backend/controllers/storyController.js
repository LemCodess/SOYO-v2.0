const Story = require('../models/storyModel');

/**
 * Like/Unlike a story (Toggle)
 * POST /api/stories/:id/like
 * Protected
 */
const likeStory = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const story = await Story.findById(id);

    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    // Check if user already liked the story
    const likeIndex = story.likes.indexOf(userId);

    if (likeIndex === -1) {
      // User hasn't liked yet - add like
      story.likes.push(userId);
    } else {
      // User already liked - remove like (unlike)
      story.likes.splice(likeIndex, 1);
    }

    await story.save();

    res.status(200).json({
      success: true,
      likes: story.likes.length,
      isLiked: likeIndex === -1, // True if we just added the like
      message: likeIndex === -1 ? 'Story liked' : 'Story unliked'
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ error: 'Failed to update like status' });
  }
};

/**
 * Add a comment to a story
 * POST /api/stories/:id/comment
 * Protected
 */
const addComment = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const userId = req.user._id;

  // Validation
  if (!text || text.trim().length === 0) {
    return res.status(400).json({ error: 'Comment text is required' });
  }

  if (text.trim().length > 500) {
    return res.status(400).json({ error: 'Comment must be 500 characters or less' });
  }

  try {
    const story = await Story.findById(id);

    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    // Sanitize text - remove potentially harmful content
    const sanitizedText = text.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    // Create new comment
    const newComment = {
      user: userId,
      username: req.user.username || req.user.name || 'Anonymous',
      text: sanitizedText,
      createdAt: new Date()
    };

    story.comments.unshift(newComment); // Add to beginning (newest first)
    await story.save();

    res.status(201).json({
      success: true,
      comment: newComment,
      totalComments: story.comments.length,
      message: 'Comment added successfully'
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
};

/**
 * Get all comments for a story
 * GET /api/stories/:id/comments
 * Public
 */
const getComments = async (req, res) => {
  const { id } = req.params;

  try {
    const story = await Story.findById(id).select('comments');

    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    // Comments are already sorted newest first (we use unshift when adding)
    res.status(200).json({
      success: true,
      comments: story.comments,
      totalComments: story.comments.length
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

/**
 * Get like status and count for a story
 * GET /api/stories/:id/likes
 * Public (but returns if current user liked if authenticated)
 */
const getLikes = async (req, res) => {
  const { id } = req.params;
  const userId = req.user?._id; // Optional - may not be authenticated

  try {
    const story = await Story.findById(id).select('likes');

    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    const isLiked = userId ? story.likes.includes(userId) : false;

    res.status(200).json({
      success: true,
      likes: story.likes.length,
      isLiked: isLiked
    });
  } catch (error) {
    console.error('Error fetching likes:', error);
    res.status(500).json({ error: 'Failed to fetch likes' });
  }
};

module.exports = {
  likeStory,
  addComment,
  getComments,
  getLikes
};
