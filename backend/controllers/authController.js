const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

const jwtSecret = 'shivanshsg7';

async function createUser(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const securedPassword = await bcrypt.hash(req.body.password, salt);

    await User.create({
      name: req.body.name,
      location: req.body.location,
      email: req.body.email,
      password: securedPassword,
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}

async function loginUser(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const email = req.body.email;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, error: 'Please try to login with correct credentials' });
    }

    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, error: 'Please try to login with correct credentials' });
    }

    const data = { user: { id: user.id } };
    const authToken = jwt.sign(data, jwtSecret);
    res.json({ success: true, authToken });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}

module.exports = {
  createUser,
  loginUser,
};

