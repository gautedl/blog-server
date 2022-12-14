const { application } = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const passport = require('passport');
require('dotenv').config();
const bodyParser = require('body-parser');
const session = require('express-session');

// app.use(bodyParser.json());

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
      }).save((err) => {
        if (err) {
          return next(err);
        }
        return res.json(user);
      });
      // try {
      //   const savedUser = await user.save();
      //   return res.json(savedUser);
      // } catch (err) {
      //   return res.json({ message: err.message });
      // }
    });
  },
];

// if (err) {
//   return next(err);
// }
// const user = new User({
//   username: req.body.username,
//   password: hashedPassword,
// }).save((err) => {
//   if (err) {
//     return next(err);
//   }
//   res.redirect('/');
// });

// const log_in = async (req, res, next) => {
//   passport.authenticate('login', async(err));
// };

// Accepts POST requests to the /login endpoint
const log_in = async function (req, res, next) {
  // Authenticate the user using passport
  passport.authenticate('login', async function (err, user) {
    try {
      if (err || !user) {
        // If there is an error or the user is not found, return an error
        return res.status(401).json({
          message: 'Authentication failed',
          error: err,
        });
      }
      // If the user is found, generate a JWT token for the user and return it in the response
      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);

        const body = { _id: user._id, username: user.username };

        const token = jwt.sign(
          {
            user: body,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: '1d',
          }
        );

        req.session.user = user._id;
        return res.json({ token, user });
      });
    } catch (err) {
      return next(err);
    }
  })(req, res, next);
};

const get_admin = (req, res, next) => {
  if (req.body.password !== process.env.ADMIN_PASS) {
    console.log('Wrong pass');
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

const is_logged_in = (req, res) => {
  console.log(req.session.user);
  if (req.session.user) {
    res.status(200).send('Logged In');
  } else {
    res.status(401).send('Not logged in');
  }
};

const log_out = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    return res.json('logged out');
  });
};

module.exports = {
  sign_up,
  log_in,
  get_admin,
  log_out,
  is_logged_in,
};
