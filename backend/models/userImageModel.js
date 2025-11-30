

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userImageSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  image: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('UserImage', userImageSchema);
