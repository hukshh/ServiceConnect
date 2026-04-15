const express = require('express');
const router = express.Router();
const {
  createReview,
  getProviderReviews,
  getMyReviews,
} = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Customer creating a review or viewing their own reviews
router.post('/', protect, authorize('customer'), createReview);
router.get('/my', protect, authorize('customer'), getMyReviews);

// Public route to view a provider's reviews
router.get('/provider/:providerId', getProviderReviews);

module.exports = router;
