const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: { type: String, required: true, minLength: 1 },
  text: { type: String, required: true, minLength: 1 },
  createdAt: { type: Date },
  lastUpdated: { type: Date },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  likes: { type: Number, default: 0 },
  posted: { type: Boolean, default: false },
});

PostSchema.virtual('date_formatted_update').get(function () {
  return this.lastUpdated
    ? DateTime.fromJSDate(this.lastUpdated).toLocaleString(DateTime.DATE_MED)
    : '';
});

PostSchema.virtual('date_formatted_create').get(function () {
  return this.createdAt
    ? DateTime.fromJSDate(this.createdAt).toLocaleString(DateTime.DATE_MED)
    : '';
});

module.exports = mongoose.model('Post', PostSchema);
