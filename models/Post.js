const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId, //associate user by id
    ref: 'users', //reference the collection
  },
  text: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  avatar: {
    //avatar of user
    type: String,
  },
  likes: [
    //array of likes
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
      },
    },
  ],
  comments: [
    //array of comments
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
      },
      text: {
        //text of comment
        type: String,
        required: true,
      },
      name: {
        //name of user
        type: String,
      },
      avatar: {
        //avatar of user
        type: String,
      },
      date: {
        //date of comment
        type: Date,
        default: Date.now,
      },
    },
  ],
  date: {
    //date of post
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('posts', PostSchema);
