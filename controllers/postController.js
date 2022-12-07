const Post = require('../models/post');
const { body, validationResult } = require('express-validator');

// Display posts that are posted
const posted_posts = async (req, res, next) => {
  try {
    const posts_list = await Post.find({ posted: true })
      .populate('user')
      .populate('comments');
    return res.json(posts_list);
  } catch (err) {
    return res.json({ message: err.message });
  }
};

// Display posts that aren't posted
const unposted_posts = async (req, res, next) => {
  try {
    const posts_list = await Post.find({ posted: false })
      .populate('user')
      .populate('comments');
    return res.json(posts_list);
  } catch (err) {
    return res.json({ message: err.message });
  }
};

const create_post = [
  body('title', 'Title must not be empty').trim().isLength({ min: 1 }).escape(),
  body('text', 'Text must not be empty').trim().isLength({ min: 1 }).escape(),

  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.json(errors.array());
    } else {
      const post = new Post({
        title: req.body.title,
        text: req.body.text,
        date: new Date(),
        user: req.user,
      });
      try {
        const savedPost = await post.save();
        return res.json(savedPost);
      } catch (err) {
        return res.json({ message: err.message });
      }
    }
  },
];

const post_detail = async (req, res) => {};

module.exports = {
  posted_posts,
  unposted_posts,
};
