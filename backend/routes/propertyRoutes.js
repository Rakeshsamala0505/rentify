const express = require('express');
const multer = require('multer');
const Property = require('../models/propertyModel');
const User = require('../models/userModel');
const authenticate = require('../middleware/authenticate');
const nodemailer = require('nodemailer');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Add property route
router.post('/', authenticate, upload.single('image'), async (req, res) => {
    const { place, area, bedrooms, restrooms, cost } = req.body;
    const userId = req.user._id;

    const newProperty = new Property({
        user: userId,
        place,
        area,
        bedrooms,
        restrooms,
        cost,
        image: req.file.path,
    });

    try {
        await newProperty.save();
        res.status(201).json({ success: true, property: newProperty });
    } catch (error) {
        console.error('Error adding property:', error.message);
        res.status(500).json({ success: false, error: 'Error adding property' });
    }
});

router.delete('/:id', authenticate, async (req, res) => {
    try {
        const property = await Property.findByIdAndDelete(req.params.id);
        if (!property) {
            return res.status(404).send({ error: 'Property not found' });
        }
        res.status(200).send({ success: true });
    } catch (error) {
        console.error('Error deleting property:', error);
        res.status(500).send({ error: 'Server error' });
    }
});

router.get('/user', authenticate, async (req, res) => {
    const userId = req.user._id;

    try {
        const properties = await Property.find({ user: userId });
        res.status(200).json({ success: true, properties });
    } catch (error) {
        console.error('Error fetching properties:', error.message);
        res.status(500).json({ success: false, error: 'Error fetching properties' });
    }
});

// Get all properties
router.get('/', async (req, res) => {
    try {
        const properties = await Property.find().populate('user', 'name');
        res.status(200).json({ success: true, properties });
    } catch (error) {
        console.error('Error fetching properties:', error.message);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Get seller details for a property and send an email
router.get('/:propertyId/seller', authenticate, async (req, res) => {
    const propertyId = req.params.propertyId;
    const userId = req.user._id;

    try {
        const property = await Property.findById(propertyId).populate('user');

        if (!property) {
            return res.status(404).json({ success: false, error: 'Property not found' });
        }

        const seller = property.user;
        const buyer = await User.findById(userId);

        if (!buyer) {
            return res.status(404).json({ success: false, error: 'Buyer not found' });
        }

        if (buyer.email === seller.email) {
            return res.status(200).json({ success: true, message: 'This property belongs to you' });
        }

        const mailOptionsToSeller = {
            from: process.env.EMAIL_USER,
            to: seller.email,
            subject: 'Someone Interested in Your Property',
            html: `
                <p>Hello ${seller.firstName},</p>
                <p>${buyer.firstName} ${buyer.lastName} is interested in your property located at <strong>${property.place}</strong>.</p>
                <p>You can contact them at:</p>
                <p>Email: ${buyer.email}</p>
                <p>Phone Number: ${buyer.phoneNumber}</p>
                <p>Best regards,</p>
                <p>Your Rentify Team</p>
            `,
        };

        const mailOptionsToBuyer = {
            from: process.env.EMAIL_USER,
            to: buyer.email,
            subject: 'Property Owner Details',
            html: `
                <p>Hello ${buyer.firstName},</p>
                <p>Please find below the details of the property you are looking for the property located at <strong>${property.place}</strong>.</p>
                <p>Property Owner Name: ${seller.firstName} ${seller.lastName}</p>
                <p>Email: ${seller.email}</p>
                <p>Phone Number: ${seller.phoneNumber}</p>
                <p>Best regards,</p>
                <p>Your Rentify Team</p>
            `,
        };
     

        transporter.sendMail(mailOptionsToSeller, (error, info) => {
            if (error) {
                console.error('Error sending email to seller:', error.message);
                return res.status(500).json({ success: false, error: 'Error sending email to seller' });
            }
            console.log('Email sent to seller:', info.response);

            transporter.sendMail(mailOptionsToBuyer, (error, info) => {
                if (error) {
                    console.error('Error sending email to buyer:', error.message);
                    return res.status(500).json({ success: false, error: 'Error sending email to buyer' });
                }
                console.log('Email sent to buyer:', info.response);
                res.status(200).json({ success: true, user: seller });
            });
        });
    } catch (error) {
        console.error('Error fetching user details:', error.message);
        res.status(500).json({ success: false, error: 'Error fetching user details' });
    }
});

router.post('/:propertyId/like', authenticate, async (req, res) => {
    const propertyId = req.params.propertyId;
    const userId = req.user._id;

    try {
        const property = await Property.findById(propertyId);

        if (!property) {
            return res.status(404).json({ success: false, error: 'Property not found' });
        }

        const isLiked = property.likes.includes(userId);

        if (isLiked) {
            // If already liked, remove the user's like
            property.likeCount = Math.max(property.likeCount - 1, 0); // Ensure like count doesn't go below 0
            property.likes = property.likes.filter(id => !id.equals(userId));
        } else {
            // If not liked, add the user's like
            property.likeCount++; // Increment like count
            property.likes.push(userId);
        }

        await property.save();
        res.status(200).json({ success: true, likeCount: property.likeCount });
    } catch (error) {
        console.error('Error liking/unliking property:', error.message);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});




module.exports = router;
