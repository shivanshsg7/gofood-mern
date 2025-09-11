const express = require('express');
const { mongoDB } = require('./db');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 5000;

// ✅ CORS Middleware BEFORE routes
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://heroic-baklava-7c01aa.netlify.app'  // ✅ Netlify URL added
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // ✅ Include OPTIONS
  credentials: true
}));

app.use(express.json()); // ✅ Must be before routes too

// Connect to MongoDB and start server
mongoDB().then(() => {

  // ✅ Routes
  app.use('/api', require('./Routes/authRoutes.js'));
  app.use('/api', require('./Routes/dataRoutes.js'));
  app.use('/api', require('./Routes/orderRoutes.js'));
  app.use('/api', require('./Routes/paymentRoutes.js'));

  // ✅ Default route
  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  app.listen(port, () => {
    console.log(`✅ Backend server running at http://localhost:${port}`);
  });

}).catch(err => {
  console.error("❌ Failed to connect to MongoDB:", err);
  process.exit(1);
});
