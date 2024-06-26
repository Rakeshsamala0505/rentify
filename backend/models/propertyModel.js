//propertyModel.js
const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  place: { type: String, required: true },
  area: { type: String, required: true },
  bedrooms: { type: Number, required: true },
  restrooms: { type: Number, required: true },
  cost: { type: String, required: true },
  image: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  likeCount: { type: Number, default: 0 }, // Add likeCount field with default value of 0
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Add likes field to store user IDs
});

const Property = mongoose.model('Property', propertySchema);

module.exports = Property;
