//auth.js
const express = require('express');
const User = require('../models/userModel');
const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt for email:', email);  // Log login attempt

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found for email:', email);  // Log if user is not found
      return res.status(401).json({ error: 'User not found' });
    }

    // Directly compare raw passwords
    if (user.password !== password) {
      console.log('Invalid password for email:', email);  // Log invalid password attempt
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = user.generateAuthToken();
    console.log('Login successful for email:', email);  // Log successful login
    res.json({
      success: true,
      user: {
        firstName: user.firstName,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('Server error:', error);  // Log server error
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
