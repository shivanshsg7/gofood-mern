const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Orders');

function getRazorpayInstance() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Missing Razorpay credentials. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in environment.');
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

async function createOrder(req, res) {
  try {
    const { amount } = req.body; // amount in INR

    if (!amount || Number.isNaN(Number(amount))) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const amountInPaise = Math.round(Number(amount) * 100);

    const razorpay = getRazorpayInstance();
    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
      notes: {},
    };

    const order = await razorpay.orders.create(options);

    return res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('createOrder error:', error.message);
    return res.status(500).json({ success: false, error: 'Failed to create order' });
  }
}

async function verifyPayment(req, res) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, email, order_data } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, error: 'Missing payment verification fields' });
    }

    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest('hex');

    const isVerified = generatedSignature === razorpay_signature;
    if (!isVerified) {
      return res.status(400).json({ success: false, error: 'Payment signature verification failed' });
    }

    // Save order to DB similar to existing order logic
    if (email && Array.isArray(order_data)) {
      const data = [...order_data];
      data.splice(0, 0, { order_date: new Date().toString() });

      const existing = await Order.findOne({ email });
      if (existing == null) {
        await Order.create({ email, order_data: [data] });
      } else {
        await Order.findOneAndUpdate({ email }, { $push: { order_data: data } });
      }
    }

    return res.json({
      success: true,
      message: 'Payment verified successfully',
      razorpay_order_id,
      razorpay_payment_id,
    });
  } catch (error) {
    console.error('verifyPayment error:', error.message);
    return res.status(500).json({ success: false, error: 'Payment verification failed' });
  }
}

module.exports = {
  createOrder,
  verifyPayment,
};

