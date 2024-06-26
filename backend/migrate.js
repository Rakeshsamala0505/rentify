// migrate.js
const mongoose = require('mongoose');
const Property = require('./models/propertyModel');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('MongoDB connected...');

    try {
      // Update all existing properties to add likeCount and likes fields if they don't already exist
      await Property.updateMany(
        {}, 
        { 
          $set: { 
            likeCount: 0, 
            likes: [] 
          } 
        }
      );
      console.log('Migration completed.');
    } catch (error) {
      console.error('Error during migration:', error);
    } finally {
      mongoose.connection.close();
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
