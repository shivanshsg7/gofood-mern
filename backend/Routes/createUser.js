const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const jwt= require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const jwtSecret = 'shivanshsg7'; 


router.post(
  '/createuser',
//   validator middleware to validate request body
  [
    body('email').isEmail(),
    body('name').isLength({ min: 5 }),
    body('password','Incorrect Password').isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const salt = await bcrypt.genSalt(10);
    let secPass = await bcrypt.hash(req.body.password, salt);
    try {
      await User.create({
        name: req.body.name,
        location: req.body.location,
        email: req.body.email,
        password: secPass,
      });
      res.json({ success: true });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }
);

router.post(
  '/loginuser',
  [
    body('email').isEmail(),
    
    body('password','Incorrect Password').isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    let email= req.body.email;
    try {
    let userData =  await User.findOne({email});
    if(!userData) {
        return res.status(400).json({ success: false, error: 'Please try to login with correct credentials' });
    }
    const passwordCompare = await bcrypt.compare(req.body.password, userData.password);
    if(!passwordCompare) {
        return res.status(400).json({ success: false, error: 'Please try to login with correct credentials' });
    }
    const data = {
      user: {
        id: userData.id,
      },
    };
    const authToken = jwt.sign(data, jwtSecret);
    res.json({ success: true,authToken: authToken });


    } catch (error) {
      console.error(error.message);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  }
);

module.exports = router;



