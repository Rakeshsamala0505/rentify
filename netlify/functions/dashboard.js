// netlify/functions/dashboard.js
const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const cors = require('cors');
const authenticate = require('../../backend/middleware/authenticate');
const Property = require('../../backend/models/propertyModel');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected...'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
  });

app.get('/.netlify/functions/dashboard', authenticate, async (req, res) => {
  try {
    const userId = req.user._id;
    const properties = await Property.find({ user: userId }).populate('user');
    res.json({ success: true, properties });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Error fetching dashboard data' });
  }
});

module.exports.handler = serverless(app);
