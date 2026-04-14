const express = require('express');
const router = express.Router();
const {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getMyServices,
} = require('../controllers/serviceController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getServices);
router.get('/:id', getServiceById);

// Provider-only routes — must come before /:id to avoid route conflict
router.get('/my/listings', protect, authorize('provider'), getMyServices);
router.post('/', protect, authorize('provider'), createService);
router.put('/:id', protect, authorize('provider'), updateService);
router.delete('/:id', protect, authorize('provider'), deleteService);

module.exports = router;
