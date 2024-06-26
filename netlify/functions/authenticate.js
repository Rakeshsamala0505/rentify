// netlify/functions/authenticate.js
const jwt = require('jsonwebtoken');
const User = require('../../backend/models/userModel'); // Ensure this path is correct

const authenticate = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log('Token received:', token);

  if (!token) {
    return res.status(401).send({ error: 'Please authenticate.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded:', decoded);

    const user = await User.findById(decoded._id);
    console.log('User found:', user);

    if (!user) {
      throw new Error('User not found');
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).send({ error: 'Authentication failed.' });
  }
};

module.exports = authenticate;
