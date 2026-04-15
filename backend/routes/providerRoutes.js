const express = require('express');
const router = express.Router();
const {
  getProviderProfile,
  createOrUpdateProfile,
  getMyProfile,
  getAllProviders,
  updateAvailability,
  blockDate,
} = require('../controllers/providerController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Provider-only routes
router.post('/profile', protect, authorize('provider'), createOrUpdateProfile);
router.get('/profile/me', protect, authorize('provider'), getMyProfile);
router.put('/availability', protect, authorize('provider'), updateAvailability);
router.put('/block-date', protect, authorize('provider'), blockDate);

// Public routes (Placing wildcards like :userId after specific routes)
router.get('/', getAllProviders);
router.get('/:userId', getProviderProfile);

module.exports = router;
