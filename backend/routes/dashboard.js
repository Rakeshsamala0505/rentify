// routes/dashboard.js
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const Property = require('../models/propertyModel');

router.get('/dashboard', authenticate, async (req, res) => {
  try {
    const userId = req.user._id;
    const properties = await Property.find({ user: userId }).populate('user');
    res.json({ success: true, properties });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Error fetching dashboard data' });
  }
});

module.exports = router;
