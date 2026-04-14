const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public routes for user registration and login
router.post('/register', registerUser);
router.post('/login', loginUser);

// Private route to get the authenticated user's profile
router.get('/me', protect, getMe);

module.exports = router;
