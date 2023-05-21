const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

//  @route  Get api/auth
//  @desc   load user
//  @access Public

router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user }).select('-password');
    return res.status(200).json(user);
  } catch (error) {
    console.log(error.message);
    return res.status(500).send('server error');
  }
});

router.post(
  '/',
  [
    check('email', 'please included a valid email').isEmail(),
    check('password', 'password should exists').exists(),
  ],
  async (req, res) => {
    const error = validationResult(req);
    // console.log(req.body)
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ error: [{ msg: 'Invalid Credientials' }] });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ error: [{ msg: 'Invalid Credientials' }] });
      }
      // encryping password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      // saving user
      await user.save();
      const payload = {
        user: user.id,
      };
      const token = jwt.sign(payload, config.get('jwtSecret'), {
        expiresIn: 36000,
      });
      return res.json({ token });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ error: 'Server error' });
    }
  }
);

module.exports = router;
