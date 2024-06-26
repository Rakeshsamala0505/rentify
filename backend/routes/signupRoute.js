const express = require('express');
const User = require('../models/userModel');
const router = express.Router();
const { createUser } = require('../controllers/userController');

router.post('/signup', createUser);


module.exports = router;
