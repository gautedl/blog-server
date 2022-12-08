const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  text: { type: String, required: true, minLength: 1 },
  dateAdded: { type: Date },
  // lastModified: { type: Date },
  // editedText: { type: String },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  likes: { type: Number },
});

module.exports = mongoose.model('Comment', CommentSchema);
