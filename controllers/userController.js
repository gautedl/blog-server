const { application } = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const passport = require('passport');
require('dotenv').config();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

// creates a user
const sign_up = [
  body('username', 'username must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('password')
    .trim()
    .isLength({ min: 5 })
    .withMessage('Password must be at least 5 char long')
    .if(body('confirmPassword').exists())
    .notEmpty()
    .custom((value, { req }) => value === req.body.confirmPassword)
    .withMessage('Passwords do not match')
    .escape(),

  async (req, res, next) => {
    const errors = validationResult(req);
    console.log(req.body);

    const existUsername = await User.findOne({ username: req.body.username });
    if (existUsername) {
      res.json('Username is taken');
    }

    if (!errors.isEmpty()) {
      res.json(errors.array());
    }

    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      if (err) {
        return next(err);
      }
      const user = new User({
        username: req.body.username,
        password: hashedPassword,
      });
      try {
        const savedUser = await user.save();
        return res.json(savedUser);
      } catch (err) {
        return res.json({ message: err.message });
      }
    });
  },
];

// const log_in = async (req, res, next) => {
//   passport.authenticate('login', async(err));
// };

// Accepts POST requests to the /login endpoint
const log_in = async function (req, res) {
  // Get the user's credentials from the request body
  const { username, password } = req.body;

  // Authenticate the user using passport
  passport.authenticate('jwt', async function (err, user) {
    if (err || !user) {
      // If there is an error or the user is not found, return an error
      return res.status(401).json({
        message: 'Authentication failed',
        error: err,
      });
    } else {
      // If the user is found, generate a JWT token for the user and return it in the response
      const token = jwt.sign(
        {
          user: user,
        },
        process.env.JWT_SECRET
      );

      return res.json({
        token: token,
        user: user,
      });
    }
  })(req, res);
};

const get_admin = (req, res, next) => {
  if (req.body.password !== process.env.ADMIN_PASS) {
    return res.json('Wrong Password');
  } else {
    User.findByIdAndUpdate(
      req.user._id,
      { $set: { admin: true } },
      {},
      function (err, result) {
        if (err) return res.json({ message: err.message });
        return res.json('Updated Succesfully');
      }
    );
  }
};

const log_out = (req, res, next) => {
  req.logout(function (err) {
    if (err) return res.json(err);
    return res.json('loged out');
  });
};

module.exports = {
  sign_up,
  log_in,
  get_admin,
  log_out,
};
