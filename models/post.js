const mongoose = require('mongoose');
const { DateTime } = require('luxon');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: { type: String, required: true, minLength: 1 },
  text: { type: String, required: true, minLength: 1 },
  date: { type: Date },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  //   comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  likes: { type: Number, default: 0 },
  posted: { type: Boolean, default: false },
});

PostSchema.virtual('date_formatted').get(function () {
  return this.time
    ? DateTime.fromJSDate(this.time).toLocaleString(DateTime.DATE_MED)
    : '';
});

module.exports = mongoose.model('Post', PostSchema);
