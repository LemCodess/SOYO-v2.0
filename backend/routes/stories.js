const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const Story = require('../models/storyModel');
const upload = require('../middleware/uploadMemory');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

const router = express.Router();

// POST a new story (Draft or Publish) - PROTECTED
// Supports cover image upload
router.post('/', requireAuth, upload.single('cover'), async (req, res) => {
  const { topicName, description, category, tags, language, chapters, status, _id } = req.body;

  if (!topicName || !description || !category || !tags || !language || !status) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const storyData = {
      userId: req.user._id,
      topicName,
      description,
      category,
      tags,
      language,
      chapters: chapters || '',
      status,
      author: req.user._id
    };

    // Handle cover image upload if provided
    if (req.file) {
      try {
        const uploadResult = await uploadToCloudinary(
          req.file.buffer,
          'soyo-story-covers'
        );
        storyData.coverImage = uploadResult.secure_url;
        storyData.coverImagePublicId = uploadResult.public_id;
        console.log('✅ Cover image uploaded:', uploadResult.secure_url);
      } catch (uploadError) {
        console.error('Cover upload error:', uploadError);
        return res.status(500).json({ error: 'Failed to upload cover image' });
      }
    }

    let story;
    if (_id) {
      // Update an existing story
      const existingStory = await Story.findById(_id);

      // If new cover is uploaded and old cover exists, delete old one
      if (req.file && existingStory?.coverImagePublicId) {
        try {
          await deleteFromCloudinary(existingStory.coverImagePublicId);
          console.log('✅ Old cover image deleted from Cloudinary');
        } catch (err) {
          console.log('⚠️ Could not delete old cover:', err.message);
        }
      }

      story = await Story.findByIdAndUpdate(_id, storyData, { new: true, runValidators: true });
      return res.status(200).json({ message: 'Story updated successfully', story });
    } else {
      // Create a new story
      story = await Story.create(storyData);
      return res.status(201).json({ message: 'Story created successfully', story });
    }
  } catch (error) {
    console.error('Error creating or updating story:', error);
    res.status(500).json({ error: 'Server error, please try again later' });
  }
});

// GET published stories for homepage with search functionality - PUBLIC
router.get('/published', async (req, res) => {
  const { searchQuery } = req.query;

  try {
    let query = { status: 'published' };

    // If a search query is provided, add it to the query
    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, 'i');
      query = {
        status: 'published',
        $or: [
          { topicName: searchRegex },      // Search by story topic name
          { category: searchRegex },       // Search by category (genre)
          { tags: searchRegex }           // Search by tags
        ]
      };
    }

    const stories = await Story.find(query).populate('userId', 'name'); // Populates author name

    // Filter by author name if search query exists
    const filteredStories = searchQuery
      ? stories.filter(story => {
          const searchRegex = new RegExp(searchQuery, 'i');
          return story.userId && story.userId.name && story.userId.name.match(searchRegex);
        })
      : stories;

    res.status(200).json(filteredStories);
  } catch (error) {
    console.error('Error fetching published stories:', error);
    res.status(500).json({ error: 'Failed to fetch stories' });
  }
});

// GET drafts for a specific user (Profile page) - PROTECTED
router.get('/drafts', requireAuth, async (req, res) => {
  try {
    const drafts = await Story.find({ userId: req.user._id, status: 'draft' });
    res.status(200).json(drafts);
  } catch (error) {
    console.error('Error fetching drafts:', error);
    res.status(500).json({ error: 'Failed to fetch drafts' });
  }
});

// GET a specific story by ID - PUBLIC (allows reading published stories)
router.get('/:id', async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }
    res.status(200).json(story);
  } catch (error) {
    console.error('Error fetching story:', error);
    res.status(500).json({ error: 'Failed to fetch story' });
  }
});

// DELETE a draft - PROTECTED
router.delete('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;

  try {
    const story = await Story.findById(id);

    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }

    // Delete cover image from Cloudinary if exists
    if (story.coverImagePublicId) {
      try {
        await deleteFromCloudinary(story.coverImagePublicId);
        console.log('✅ Cover image deleted from Cloudinary');
      } catch (err) {
        console.log('⚠️ Could not delete cover image:', err.message);
      }
    }

    await Story.findByIdAndDelete(id);
    res.status(200).json({ message: 'Draft deleted successfully' });
  } catch (error) {
    console.error('Error deleting story:', error);
    res.status(500).json({ error: 'Failed to delete draft' });
  }
});

module.exports = router;
