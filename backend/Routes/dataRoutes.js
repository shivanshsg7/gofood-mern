const express = require('express');
const { getFoodData } = require('../controllers/dataController');

const router = express.Router();

router.post('/foodData', getFoodData);

module.exports = router;

