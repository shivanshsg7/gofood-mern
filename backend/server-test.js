const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 5000;

// CORS Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());

// Simple test route
app.get('/', (req, res) => {
  res.json({ message: 'Backend server is running!' });
});

// Payment routes
app.use('/api/payment', require('./Routes/Payment.js'));

// Simple order route for testing
app.post('/api/orderData', (req, res) => {
  console.log('Order received:', req.body);
  res.json({ success: true, message: 'Order received successfully' });
});

// Start the server immediately
app.listen(port, () => {
  console.log(`✅ Test Backend server running at http://localhost:${port}`);
});