const express = require('express');
const { createOrder, verifyPayment } = require('../controllers/paymentController');

const router = express.Router();

router.post('/create-razorpay-order', createOrder);
router.post('/verify-razorpay-payment', verifyPayment);

module.exports = router;

