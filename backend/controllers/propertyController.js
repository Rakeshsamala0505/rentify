//propertyController.js
const Property = require('../models/propertyModel');

exports.createProperty = async (req, res) => {
  const { place, area, bedrooms, restrooms, cost } = req.body;
  const userId = req.user._id; // Assuming user ID is available in the request

  try {
    const property = new Property({
      place,
      area,
      bedrooms,
      restrooms,
      cost,
      image: req.file.path, // Assuming multer is used for file upload
      user: userId
    });
    await property.save();
    res.status(201).json({ success: true, message: 'Property added successfully' });
  } catch (error) {
    console.error('Error adding property:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getPropertiesByUser = async (req, res) => {
  const userId = req.user._id;

  try {
    const properties = await Property.find({ user: userId });
    res.status(200).json({ properties });
  } catch (error) {
    console.error('Error fetching properties:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteProperty = async (req, res) => {
  const propertyId = req.params.id;

  try {
    await Property.findByIdAndDelete(propertyId);
    res.status(200).json({ success: true, message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error deleting property:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
