// netlify/functions/auth.js
const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('../../backend/models/userModel'); // Adjust the path as necessary
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

app.post('/.netlify/functions/auth/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt for email:', email);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(401).json({ error: 'User not found' });
    }

    if (user.password !== password) {
      console.log('Invalid password for email:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = user.generateAuthToken();
    console.log('Login successful for email:', email);
    res.json({
      success: true,
      user: {
        firstName: user.firstName,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports.handler = serverless(app);
