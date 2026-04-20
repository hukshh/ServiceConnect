const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protects routes by verifying the JWT Bearer token and attaching the user to req.user
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      if (req.user.isBlocked) {
        return res
          .status(403)
          .json({ message: 'Your account has been blocked. Contact admin.' });
      }

      next();
    } catch (error) {
      return res
        .status(401)
        .json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: 'Not authorized, no token provided' });
  }
};

// Restricts route access to users with one of the specified roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      console.log(`[AUTH] 403 Forbidden: User ${req.user._id} with role '${req.user.role}' tried to access route ${req.originalUrl} requiring one of: ${roles.join(', ')}`);
      return res.status(403).json({
        message: `Role '${req.user.role}' is not authorized to access this route`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
