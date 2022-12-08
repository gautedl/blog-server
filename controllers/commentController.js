const Comment = require('../models/comment');
const { body, validationResult } = require('express-validator');

// Creates a comment
const comment_create = [
  body('text', 'Text must not be empty').trim().isLength({ min: 1 }).escape(),

  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.json(errors.array());
    } else {
      const comment = new Comment({
        text: req.body.text,
        dateAdded: new Date(),
        user: req.user,
      });
      try {
        const savedComment = await comment.save();
        return res.json(savedComment);
      } catch (err) {
        return res.json({ message: err.message });
      }
    }
  },
];

// Edit comment
// Not sure if needed

// Delete comment as an admin
const comment_delete = async (req, res) => {
  try {
    if (req.user.admin === false) {
      return res.json('Not an admin');
    } else {
      const deleteComment = await Comment.findByIdAndDelete(req.params.id);
      return res.json(deleteComment);
    }
  } catch (err) {
    return res.json({ message: err.message });
  }
};

// Like comment
const comment_like = (req, res, next) => {
  Comment.findByIdAndUpdate(
    req.body._id,
    { $inc: { likes: 1 } },
    {},
    function (err, result) {
      if (err) return res.json({ message: err.message });
      return res.json('Liked!');
    }
  );
};

module.exports = {
  comment_create,
  comment_delete,
  comment_like,
};
