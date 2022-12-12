const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: { type: String, required: true, minLength: 1 },
  text: { type: String, required: true, minLength: 1 },
  description: { type: String, required: true, minLength: 1, maxLength: 140 },
  createdAt: { type: Date },
  lastUpdated: { type: Date },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  likes: { type: Number, default: 0 },
  posted: { type: Boolean, default: false },
});

PostSchema.virtual('date_formatted_created').get(function () {
  return this.createdAt.toLocaleDateString('en-gb', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minutes: '2-digit',
  });
});

PostSchema.virtual('date_formatted_updated').get(function () {
  return this.lastUpdated.toLocaleDateString('en-gb', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minutes: '2-digit',
  });
});

module.exports = mongoose.model('Post', PostSchema);
