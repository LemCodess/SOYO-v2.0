const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const storySchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    topicName: {
      type: String,
      required: [true, 'Story title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [200, 'Title must not exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Story description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [5000, 'Description must not exceed 5000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: [
          'Action',
          'Adventure',
          'Fanfiction',
          'Fantasy',
          'Horror',
          'Humor',
          'Mystery',
          'Poetry',
          'Romance',
          'Science Fiction',
        ],
        message: '{VALUE} is not a valid category',
      },
    },
    tags: {
      type: String,
      required: [true, 'Tags are required'],
      trim: true,
      maxlength: [200, 'Tags must not exceed 200 characters'],
    },
    language: {
      type: String,
      required: [true, 'Language is required'],
      enum: {
        values: ['English', 'Bangla'],
        message: '{VALUE} is not a valid language',
      },
    },
    status: {
      type: String,
      enum: {
        values: ['draft', 'published'],
        message: '{VALUE} is not a valid status',
      },
      default: 'draft',
      index: true,
    },
    chapters: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient queries
storySchema.index({ userId: 1, status: 1 });
storySchema.index({ status: 1, createdAt: -1 });
storySchema.index({ topicName: 'text', description: 'text', tags: 'text' }); // Text search index

/**
 * Remove version key from JSON response
 */
storySchema.methods.toJSON = function () {
  const story = this.toObject();
  delete story.__v;
  return story;
};

module.exports = mongoose.model('Story', storySchema);
