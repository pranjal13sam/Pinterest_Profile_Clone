const mongoose = require('mongoose');
const { stringify } = require('uuid');

const postSchema = new mongoose.Schema({
  imagetext: {
    type: String,
    required: true,
  },
  image:{
    type:String
  },
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  },
  currentDate: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: Array,
    default: [],
  },
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
