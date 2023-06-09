const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const c = require('../../config/default.json');

const User = require('../../models/User');

// @route   POST api/users
// @desc    Register User
// @access  Public
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters',
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }
      const avatar = gravatar.url(email, {
        s: '200', //size
        r: 'pg', //rating
        d: 'mm', //default
      });

      user = new User({
        name,
        email,
        avatar,
        password,
      });
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();
      //Return jsonwebtoken
      const payload = {
        user: {
          id: user.id, //mongoose uses abstraction so we don't need to use _id
        },
      };
      jwt.sign(
        payload,
        c.jwtToken,
        { expiresIn: 360000 }, //change to 3600 in production
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        },
      );

      // res.send('User Registered');
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
    // res.send('Users Works');
  },
);

module.exports = router;
