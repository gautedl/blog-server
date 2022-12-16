const Post = require('../models/post');
const { body, validationResult, cookie } = require('express-validator');

// Display posts that are posted
const posted_posts = async (req, res, next) => {
  try {
    const posts_list = await Post.find({ posted: true }).populate('comments');
    return res.json(posts_list);
  } catch (err) {
    return res.json({ message: err.message });
  }
};

// Display posts that aren't posted
const unposted_posts = async (req, res, next) => {
  try {
    const posts_list = await Post.find({ posted: false }).populate('comments');
    return res.json(posts_list);
  } catch (err) {
    return res.json({ message: err.message });
  }
};

// Creates a post, but doesn't post it
const create_post = [
  body('title', 'Title must not be empty').trim().isLength({ min: 1 }).escape(),
  body('text', 'Text must not be empty').trim().isLength({ min: 1 }).escape(),
  body('description', 'Description must be between 1 and 140 characters')
    .trim()
    .isLength({ min: 1, max: 140 })
    .escape(),

  async (req, res, next) => {
    const errors = validationResult(req);

    if (req.session.user.admin === false) {
      return res.json('Not an admin');
    }

    if (!errors.isEmpty()) {
      res.json(errors.array());
    } else {
      const post = new Post({
        title: req.body.title,
        text: req.body.text,
        description: req.body.description,
        createdAt: new Date(),
        user: req.body.user,
        posted: req.body.posted,
      });
      try {
        const savedPost = await post.save();
        return res.json('posted');
      } catch (err) {
        return res.json({ message: err.message });
      }
    }
  },
];

// Post a post
const post_post = (req, res, next) => {
  if (req.session.user.admin === false) {
    return res.json('Not and Admin');
  } else {
    Post.findByIdAndUpdate(
      req.body._id,
      { $set: { posted: true } },
      {},
      function (err, result) {
        if (err) return res.json({ message: err.message });
        return res.json('Posted!');
      }
    );
  }
};

// Edit an excisitng post
const edit_post = [
  body('title', 'Title must not be empty').trim().isLength({ min: 1 }).escape(),
  body('text', 'Text must not be empty').trim().isLength({ min: 1 }).escape(),
  body('description', 'Description must be between 1 and 140 characters')
    .trim()
    .isLength({ min: 1, max: 140 })
    .escape(),

  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.json(errors.array());
    } else {
      try {
        console.log(req.session);
        if (req.session.user.admin === false) {
          return res.json('Not an admin');
        }
        const updatePost = await Post.updateOne(
          { _id: req.params.id },
          {
            title: req.body.title,
            text: req.body.text,
            description: req.body.description,
            lastUpdated: new Date(),
            user: req.body.user,
            posted: req.body.posted,
            _id: req.params.id,
          }
        );
        return res.json('Updated');
      } catch (err) {
        return res.json({ message: err.message });
      }
    }
  },
];

// Details of a post
const post_detail = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('user')
      .populate('comments')
      .populate([
        {
          path: 'comments',
          populate: { path: 'user' },
        },
      ]);
    return res.json(post);
  } catch (err) {
    return res.json({ message: err.message });
  }
};

//Get number of likes a post has
const get_likes_post = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    return res.json(post.likes);
  } catch (err) {
    return res.json({ message: err.message });
  }
};

// Delete a post
const post_delete = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.json(errors.array());
  }

  try {
    if (req.session.user.admin === false) {
      return res.json('Not an admin');
    } else {
      const deletePost = await Post.findByIdAndDelete(req.params.id);
      return res.json('Deleted');
    }
  } catch (err) {
    return res.json({ message: err.message });
  }
};

// Add a like to the post
const post_like = (req, res, next) => {
  Post.findByIdAndUpdate(
    req.params.id,
    { $inc: { likes: 1 } },
    {},
    function (err, result) {
      if (err) return res.json({ message: err.message });
      return res.json('Liked!');
    }
  );
};

module.exports = {
  posted_posts,
  unposted_posts,
  create_post,
  post_detail,
  edit_post,
  post_post,
  post_delete,
  post_like,
  get_likes_post,
};
