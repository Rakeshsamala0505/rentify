// netlify/functions/signupRoute.js
const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const cors = require('cors');
const { createUser } = require('../../backend/controllers/userController');
const User = require('../../backend/models/userModel');
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

const router = express.Router();

// Signup route
router.post('/', async (req, res) => {
  try {
    await createUser(req, res);
  } catch (error) {
    console.error('Error signing up user:', error.message);
    res.status(500).json({ success: false, error: 'Error signing up user' });
  }
});

app.use('/.netlify/functions/signupRoute', router);

module.exports.handler = serverless(app);
