const express = require('express');
const mongoDB = require('./db');
const cors = require('cors');

const app = express();
const port = 5000;

// Connect to MongoDB and then start the server
mongoDB().then(() => {
  // CORS Middleware
  app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }));

  app.use(express.json()); // Middleware to parse JSON bodies

  // Routes
  app.use('/api', require('./Routes/Createuser.js'));
  app.use('/api', require('./Routes/DisplayData.js'));
  app.use('/api', require('./Routes/OrderData.js')); // <- Correct path

  // Default Route
  app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  // Start the server
  app.listen(port, () => {
    console.log(`✅ Backend server running at http://localhost:${port}`);
  });
}).catch(err => {
  console.error("❌ Failed to connect to MongoDB:", err);
  process.exit(1);
});
