const express = require('express');
const router = express.Router();
const {
  getProviderProfile,
  createOrUpdateProfile,
  getMyProfile,
  getAllProviders,
} = require('../controllers/providerController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllProviders);
router.get('/:userId', getProviderProfile);

// Provider-only routes
router.post('/profile', protect, authorize('provider'), createOrUpdateProfile);
router.get('/profile/me', protect, authorize('provider'), getMyProfile);

module.exports = router;
