const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userImageSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      unique: true, // Each user can have only one profile picture record
      index: true,
    },
    image: {
      type: String,
      required: [true, 'Image filename is required'],
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Remove version key from JSON response
 */
userImageSchema.methods.toJSON = function () {
  const userImage = this.toObject();
  delete userImage.__v;
  return userImage;
};

module.exports = mongoose.model('UserImage', userImageSchema);
