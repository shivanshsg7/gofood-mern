const Order = require('../models/Orders');

async function createOrder(req, res) {
  let data = req.body.order_data;
  data.splice(0, 0, { order_date: new Date().toString() });

  try {
    const existingOrder = await Order.findOne({ email: req.body.email });

    if (existingOrder == null) {
      await Order.create({
        email: req.body.email,
        order_data: [data],
      });
      return res.json({ success: true });
    }

    await Order.findOneAndUpdate(
      { email: req.body.email },
      { $push: { order_data: data } }
    );
    return res.json({ success: true });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: 'Server Error', message: error.message });
  }
}

async function getMyOrders(req, res) {
  try {
    const myData = await Order.findOne({ email: req.body.email });
    // If no order found, return empty order_data array
    if (!myData) {
      return res.json({ orderData: { order_data: [] } });
    }
    return res.json({ orderData: myData });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({ error: 'Server Error', message: error.message });
  }
}

module.exports = {
  createOrder,
  getMyOrders,
};

