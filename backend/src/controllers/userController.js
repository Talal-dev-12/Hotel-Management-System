const User = require('../models/User');
const asyncHandler = require('../middlewares/asyncHandler');
const { ErrorResponse } = require('../utils/errorResponse');

/**
 * @desc    Get all users
 * @route   GET /api/users
 * @access  Private (Admin, Manager)
 */
exports.getUsers = asyncHandler(async (req, res, next) => {
  const { role, status, search, page = 1, limit = 10 } = req.query;

  // Build query
  const query = {};
  
  if (role) query.role = role;
  if (status) query.status = status;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  // Execute query with pagination
  const users = await User.find(query)
    .select('-password')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort('-createdAt');

  const count = await User.countDocuments(query);

  res.status(200).json({
    success: true,
    count: users.length,
    total: count,
    totalPages: Math.ceil(count / limit),
    currentPage: parseInt(page),
    data: users,
  });
});

/**
 * @desc    Get single user
 * @route   GET /api/users/:id
 * @access  Private (Admin, Manager)
 */
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * @desc    Create user (staff/guest)
 * @route   POST /api/users
 * @access  Private (Admin, Manager)
 */
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: user,
  });
});

/**
 * @desc    Update user
 * @route   PUT /api/users/:id
 * @access  Private (Admin, Manager)
 */
exports.updateUser = asyncHandler(async (req, res, next) => {
  // Don't allow password update through this route
  if (req.body.password) {
    delete req.body.password;
  }

  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: user,
  });
});

/**
 * @desc    Deactivate user
 * @route   PUT /api/users/:id/deactivate
 * @access  Private (Admin)
 */
exports.deactivateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { status: 'inactive' },
    { new: true }
  );

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'User deactivated successfully',
    data: user,
  });
});

/**
 * @desc    Activate user
 * @route   PUT /api/users/:id/activate
 * @access  Private (Admin)
 */
exports.activateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { status: 'active' },
    { new: true }
  );

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'User activated successfully',
    data: user,
  });
});

/**
 * @desc    Delete user
 * @route   DELETE /api/users/:id
 * @access  Private (Admin)
 */
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
    data: {},
  });
});