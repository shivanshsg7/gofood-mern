const express = require('express');
const router = express.Router();
const Order = require('../models/Orders');

// Route to store order data
router.post('/orderData', async (req, res) => {
    let data = req.body.order_data;

    // Insert order_date at the beginning
    data.splice(0, 0, {
    order_date: new Date().toString(), // saves full timestamp like "Fri Jul 11 2025 15:42:10 GMT+0530"
});


    try {
        let eId = await Order.findOne({ email: req.body.email });
        console.log(eId);

        if (eId == null) {
            await Order.create({
                email: req.body.email,
                order_data: [data]
            });
            res.json({ success: true });
        } else {
            await Order.findOneAndUpdate(
                { email: req.body.email },
                { $push: { order_data: data } }
            );
            res.json({ success: true });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Server Error", message: error.message });
    }
});

// ✅ Corrected route to fetch user's order history
router.post('/myorderData', async (req, res) => {
    try {
        let myData = await Order.findOne({ email: req.body.email });
        res.json({ orderData: myData });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Server Error", message: error.message });
    }
});

module.exports = router;
