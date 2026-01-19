const Room = require('../models/Room');
const asyncHandler = require('../middlewares/asyncHandler');
const { ErrorResponse } = require('../utils/errorResponse');

/**
 * @desc    Get all rooms
 * @route   GET /api/rooms
 * @access  Public
 */
exports.getRooms = asyncHandler(async (req, res, next) => {
  const { roomType, status, minPrice, maxPrice, page = 1, limit = 10 } = req.query;

  // Build query
  const query = { isActive: true };
  
  if (roomType) query.roomType = roomType;
  if (status) query.status = status;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = parseFloat(minPrice);
    if (maxPrice) query.price.$lte = parseFloat(maxPrice);
  }

  // Execute query with pagination
  const rooms = await Room.find(query)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort('roomNumber');

  const count = await Room.countDocuments(query);

  res.status(200).json({
    success: true,
    count: rooms.length,
    total: count,
    totalPages: Math.ceil(count / limit),
    currentPage: parseInt(page),
    data: rooms,
  });
});

/**
 * @desc    Get available rooms
 * @route   GET /api/rooms/available
 * @access  Public
 */
exports.getAvailableRooms = asyncHandler(async (req, res, next) => {
  const { roomType } = req.query;

  const query = { status: 'Available', isActive: true };
  if (roomType) query.roomType = roomType;

  const rooms = await Room.find(query).sort('price');

  res.status(200).json({
    success: true,
    count: rooms.length,
    data: rooms,
  });
});

/**
 * @desc    Get single room
 * @route   GET /api/rooms/:id
 * @access  Public
 */
exports.getRoom = asyncHandler(async (req, res, next) => {
  const room = await Room.findById(req.params.id);

  if (!room) {
    return next(new ErrorResponse('Room not found', 404));
  }

  res.status(200).json({
    success: true,
    data: room,
  });
});

/**
 * @desc    Add new room
 * @route   POST /api/rooms
 * @access  Private (Admin, Manager)
 */
exports.createRoom = asyncHandler(async (req, res, next) => {
  // Check if room number already exists
  const roomExists = await Room.findOne({ roomNumber: req.body.roomNumber });
  if (roomExists) {
    return next(new ErrorResponse('Room number already exists', 400));
  }

  const room = await Room.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Room created successfully',
    data: room,
  });
});

/**
 * @desc    Update room
 * @route   PUT /api/rooms/:id
 * @access  Private (Admin, Manager)
 */
exports.updateRoom = asyncHandler(async (req, res, next) => {
  let room = await Room.findById(req.params.id);

  if (!room) {
    return next(new ErrorResponse('Room not found', 404));
  }

  room = await Room.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: 'Room updated successfully',
    data: room,
  });
});

/**
 * @desc    Update room status
 * @route   PUT /api/rooms/:id/status
 * @access  Private (Admin, Manager, Receptionist)
 */
exports.updateRoomStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;

  if (!status) {
    return next(new ErrorResponse('Please provide status', 400));
  }

  const room = await Room.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (!room) {
    return next(new ErrorResponse('Room not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Room status updated successfully',
    data: room,
  });
});

/**
 * @desc    Delete room
 * @route   DELETE /api/rooms/:id
 * @access  Private (Admin)
 */
exports.deleteRoom = asyncHandler(async (req, res, next) => {
  const room = await Room.findById(req.params.id);

  if (!room) {
    return next(new ErrorResponse('Room not found', 404));
  }

  // Soft delete by setting isActive to false
  room.isActive = false;
  await room.save();

  res.status(200).json({
    success: true,
    message: 'Room deleted successfully',
    data: {},
  });
});

/**
 * @desc    Get room statistics
 * @route   GET /api/rooms/stats
 * @access  Private (Admin, Manager)
 */
exports.getRoomStats = asyncHandler(async (req, res, next) => {
  const stats = await Room.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const totalRooms = await Room.countDocuments({ isActive: true });

  res.status(200).json({
    success: true,
    data: {
      total: totalRooms,
      byStatus: stats,
    },
  });
});