const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getAllProviders,
  verifyProvider,
  blockUser,
  deleteUser,
  getDashboardStats,
  getMonthlyStats,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All admin routes must go through protect & authorize('admin')
router.use(protect);
router.use(authorize('admin'));

// Overview Stats
router.get('/stats', getDashboardStats);
router.get('/monthly-stats', getMonthlyStats);

// User Management
router.get('/users', getAllUsers);
router.put('/users/:id/block', blockUser);
router.delete('/users/:id', deleteUser);

// Provider Management
router.get('/providers', getAllProviders);
router.put('/providers/:id/verify', verifyProvider);

module.exports = router;
