const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getProviderBookings,
  updateBookingStatus,
  getAllBookings,
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Customer routes
router.post('/', protect, authorize('customer'), createBooking);
router.get('/my', protect, authorize('customer'), getMyBookings);
router.put('/:id/cancel', protect, authorize('customer'), cancelBooking);

// Provider routes
router.get('/provider', protect, authorize('provider'), getProviderBookings);
router.put('/:id/status', protect, authorize('provider'), updateBookingStatus);

// Admin routes
router.get('/all', protect, authorize('admin'), getAllBookings);

// Shared route (Customer & Provider) — must come after specific string rules to prevent `my` from being read as `:id`
router.get('/:id', protect, getBookingById); 

module.exports = router;
