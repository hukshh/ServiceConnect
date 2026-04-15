const mongoose = require('mongoose');
const Review = require('../models/Review');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const ProviderProfile = require('../models/ProviderProfile');

// @desc    Create a new review (customer only)
// @route   POST /api/reviews
// @access  Customer
const createReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;

    // Find and validate the booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to review this booking' });
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({ message: 'You can only review completed bookings' });
    }

    if (booking.isReviewed) {
      return res.status(400).json({ message: 'You have already reviewed this booking' });
    }

    // Create the review
    const review = await Review.create({
      booking: bookingId,
      customer: req.user._id,
      provider: booking.provider,
      service: booking.service,
      rating: Number(rating),
      comment,
    });

    // Mark booking as reviewed
    booking.isReviewed = true;
    await booking.save();

    // Re-calculate Service Rating using MongoDB Aggregation Pipeline
    const serviceStats = await Review.aggregate([
      { $match: { service: new mongoose.Types.ObjectId(booking.service) } },
      { $group: { _id: '$service', avgRating: { $avg: '$rating' }, numReviews: { $sum: 1 } } }
    ]);

    if (serviceStats.length > 0) {
      await Service.findByIdAndUpdate(booking.service, {
        rating: Math.round(serviceStats[0].avgRating * 10) / 10,
        numReviews: serviceStats[0].numReviews
      });
    }

    // Re-calculate Provider Rating using MongoDB Aggregation Pipeline
    const providerStats = await Review.aggregate([
      { $match: { provider: new mongoose.Types.ObjectId(booking.provider) } },
      { $group: { _id: '$provider', avgRating: { $avg: '$rating' }, numReviews: { $sum: 1 } } }
    ]);

    if (providerStats.length > 0) {
      await ProviderProfile.findOneAndUpdate(
        { user: booking.provider },
        {
          rating: Math.round(providerStats[0].avgRating * 10) / 10,
          numReviews: providerStats[0].numReviews
        }
      );
    }

    res.status(201).json(review);
  } catch (error) {
    if (error.code === 11000) {
       return res.status(400).json({ message: 'A review for this booking already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all reviews for a specific provider (public)
// @route   GET /api/reviews/provider/:providerId
// @access  Public
const getProviderReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ provider: req.params.providerId })
      .populate('customer', 'name profilePhoto')
      .populate('service', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all reviews written by the logged-in customer
// @route   GET /api/reviews/my
// @access  Customer
const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ customer: req.user._id })
      .populate('provider', 'name profilePhoto')
      .populate('service', 'title')
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createReview,
  getProviderReviews,
  getMyReviews,
};
