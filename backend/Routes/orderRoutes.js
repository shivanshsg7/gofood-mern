const express = require('express');
const { createOrder, getMyOrders } = require('../controllers/orderController');

const router = express.Router();

router.post('/orderData', createOrder);
router.post('/myorderData', getMyOrders);

module.exports = router;

