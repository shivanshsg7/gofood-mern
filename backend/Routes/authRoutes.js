const express = require('express');
const { body } = require('express-validator');
const { createUser, loginUser } = require('../controllers/authController');

const router = express.Router();

router.post(
  '/createuser',
  [
    body('email').isEmail(),
    body('name').isLength({ min: 5 }),
    body('password', 'Incorrect Password').isLength({ min: 5 }),
  ],
  createUser
);

router.post(
  '/loginuser',
  [
    body('email').isEmail(),
    body('password', 'Incorrect Password').isLength({ min: 5 }),
  ],
  loginUser
);

module.exports = router;

