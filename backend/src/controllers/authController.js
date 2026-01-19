const User = require('../models/User');
const asyncHandler = require('../middlewares/asyncHandler');
const { ErrorResponse } = require('../utils/errorResponse');

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public (Admin only for staff)
 */
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role, phone, address } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new ErrorResponse('Email already registered', 400));
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role: role || 'Guest',
    phone,
    address,
  });

  // Generate token and send response
  sendTokenResponse(user, 201, res, 'Registration successful');
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse('Please provide email and password', 400));
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check if user is active
  if (user.status !== 'active') {
    return next(new ErrorResponse('Account is inactive', 403));
  }

  // Check if password matches
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Generate token and send response
  sendTokenResponse(user, 200, res, 'Login successful');
});

/**
 * @desc    Logout user / Clear cookie
 * @route   POST /api/auth/logout
 * @access  Private
 */
exports.logout = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'Logout successful',
    data: {},
  });
});

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/profile
 * @access  Private
 */
exports.getProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
exports.updateProfile = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    phone: req.body.phone,
    address: req.body.address,
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: user,
  });
});

/**
 * @desc    Change password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
exports.changePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  if (!(await user.comparePassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Current password is incorrect', 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password changed successfully',
  });
});

/**
 * Helper function to get token from model, create cookie and send response
 */
const sendTokenResponse = (user, statusCode, res, message) => {
  // Create token
  const token = user.generateToken();
  const refreshToken = user.generateRefreshToken();

  res.status(statusCode).json({
    success: true,
    message,
    token,
    refreshToken,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};