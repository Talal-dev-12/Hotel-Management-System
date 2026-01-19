const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/env');
const { ErrorResponse } = require('../utils/errorResponse');

/**
 * Protect routes - Verify JWT token
 */
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Make sure token exists
    if (!token) {
      return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, config.JWT_SECRET);

      // Find user by ID from token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return next(new ErrorResponse('User not found', 404));
      }

      // Check if user is active
      if (req.user.status !== 'active') {
        return next(new ErrorResponse('User account is inactive', 403));
      }

      next();
    } catch (err) {
      return next(new ErrorResponse('Not authorized to access this route', 401));
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Grant access to specific roles
 * @param  {...string} roles - Allowed roles
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role '${req.user.role}' is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};

/**
 * Optional authentication - doesn't fail if no token
 */
exports.optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
      } catch (err) {
        // Token invalid, continue without user
        req.user = null;
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};