const User = require('../models/userModel');

exports.createUser = async (req, res) => {
  const { firstName, lastName, email, phoneNumber, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'User already exists with this email' });
    }

    // Save the password directly without hashing
    const newUser = new User({ firstName, lastName, email, phoneNumber, password });
    await newUser.save();
    res.status(201).json({ success: true, message: 'User created successfully', user: newUser });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error creating user', error: error.message });
  }
};



exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Login attempt:', email);
    const user = await User.findOne({ email });

    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ success: false, message: 'Invalid email' });
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      console.log('Incorrect password for user:', email);
      return res.status(401).json({ success: false, message: 'Incorrect password' });
    }

    const token = user.generateAuthToken();
    console.log('Login successful for user:', email);
    res.status(200).json({ success: true, token, firstName: user.firstName, message: 'Login successful' });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
