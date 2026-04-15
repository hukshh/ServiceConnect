const express = require('express');
const router = express.Router();
const { applyPromo, createPromo, listPromos } = require('../controllers/promoController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Customer
router.post('/apply', protect, authorize('customer'), applyPromo);

// Admin
router.post('/', protect, authorize('admin'), createPromo);
router.get('/', protect, authorize('admin'), listPromos);

module.exports = router;
