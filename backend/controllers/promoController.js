const PromoCode = require('../models/PromoCode');

// @desc    Apply a promo code (customer)
// @route   POST /api/promo/apply
// @access  Customer
const applyPromo = async (req, res) => {
  try {
    const { code, orderValue } = req.body;

    if (!code || !orderValue) {
      return res.status(400).json({ message: 'Code and orderValue are required' });
    }

    const promo = await PromoCode.findOne({ 
      code: code.toUpperCase(),
      isActive: true,
    });

    if (!promo) {
      return res.status(404).json({ message: 'Invalid or inactive promo code' });
    }

    if (promo.usedCount >= promo.maxUses) {
      return res.status(400).json({ message: 'Promo code usage limit reached' });
    }

    if (new Date() > new Date(promo.expiresAt)) {
      return res.status(400).json({ message: 'Promo code has expired' });
    }

    if (orderValue < promo.minOrderValue) {
      return res.status(400).json({ message: `Minimum order value of ₹${promo.minOrderValue} required` });
    }

    let discountAmount = 0;
    if (promo.discountType === 'percentage') {
      discountAmount = (promo.discountValue / 100) * orderValue;
    } else {
      discountAmount = promo.discountValue;
    }

    // Ensure discount doesn't exceed order value
    discountAmount = Math.min(discountAmount, orderValue);

    res.status(200).json({
      message: 'Promo code applied successfully',
      code: promo.code,
      discountAmount: Number(discountAmount.toFixed(2)),
      originalValue: orderValue,
      finalValue: Number((orderValue - discountAmount).toFixed(2))
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create a new promo code (admin only)
// @route   POST /api/promo
// @access  Admin
const createPromo = async (req, res) => {
  try {
    const { code, discountType, discountValue, minOrderValue, maxUses, expiresAt } = req.body;

    // Check if code already exists
    const existing = await PromoCode.findOne({ code: code.toUpperCase() });
    if (existing) {
      return res.status(400).json({ message: 'Promo code already exists' });
    }

    const promo = await PromoCode.create({
      code,
      discountType,
      discountValue,
      minOrderValue: minOrderValue || 0,
      maxUses: maxUses || 100,
      expiresAt,
    });

    res.status(201).json(promo);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    List all promo codes (admin only)
// @route   GET /api/promo
// @access  Admin
const listPromos = async (req, res) => {
  try {
    const promos = await PromoCode.find().sort({ createdAt: -1 });
    res.status(200).json(promos);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  applyPromo,
  createPromo,
  listPromos,
};
