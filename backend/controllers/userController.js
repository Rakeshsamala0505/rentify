const User = require('../models/userModel');

// Function to create a new user
exports.createUser = async (req, res) => {
  const { firstName, lastName, email, phoneNumber, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'User already exists with this email' });
    }

    // Create a new user instance
    const newUser = new User({ firstName, lastName, email, phoneNumber, password });
    await newUser.save(); // Save the new user to the database

    // Respond with success message and user data
    res.status(201).json({ success: true, message: 'User created successfully', user: newUser });
  } catch (error) {
    // Handle errors during user creation
    res.status(400).json({ success: false, message: 'Error creating user', error: error.message });
  }
};

// Function to handle user login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by their email
    const user = await User.findOne({ email });

    // If user does not exist, respond with error
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ success: false, message: 'Invalid email' });
    }

    // Compare the entered password with the stored password hash
    const isPasswordMatch = await user.comparePassword(password);

    // If passwords do not match, respond with error
    if (!isPasswordMatch) {
      console.log('Incorrect password for user:', email);
      return res.status(401).json({ success: false, message: 'Incorrect password' });
    }

    // Generate a JWT token for authentication
    const token = user.generateAuthToken();

    // Respond with success message, user data, and token
    res.status(200).json({ success: true, token, firstName: user.firstName, message: 'Login successful' });
  } catch (error) {
    // Handle server errors
    console.error('Server error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
