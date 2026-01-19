const Reservation = require('../models/Reservation');
const Room = require('../models/Room');
const asyncHandler = require('../middlewares/asyncHandler');
const { ErrorResponse } = require('../utils/errorResponse');

/**
 * @desc    Check room availability
 * @route   POST /api/reservations/check-availability
 * @access  Public
 */
exports.checkAvailability = asyncHandler(async (req, res, next) => {
  const { checkInDate, checkOutDate, roomType } = req.body;

  // Find rooms that are not booked during the requested period
  const bookedRooms = await Reservation.find({
    bookingStatus: { $in: ['Confirmed', 'CheckedIn'] },
    $or: [
      {
        checkInDate: { $lte: new Date(checkOutDate) },
        checkOutDate: { $gte: new Date(checkInDate) },
      },
    ],
  }).distinct('roomId');

  // Find available rooms
  const query = {
    _id: { $nin: bookedRooms },
    status: 'Available',
    isActive: true,
  };

  if (roomType) query.roomType = roomType;

  const availableRooms = await Room.find(query);

  res.status(200).json({
    success: true,
    count: availableRooms.length,
    data: availableRooms,
  });
});

/**
 * @desc    Create new reservation
 * @route   POST /api/reservations
 * @access  Private
 */
exports.createReservation = asyncHandler(async (req, res, next) => {
  const { roomId, checkInDate, checkOutDate } = req.body;

  // Check if room exists
  const room = await Room.findById(roomId);
  if (!room) {
    return next(new ErrorResponse('Room not found', 404));
  }

  // Check if room is available
  const existingReservation = await Reservation.findOne({
    roomId,
    bookingStatus: { $in: ['Confirmed', 'CheckedIn'] },
    $or: [
      {
        checkInDate: { $lte: new Date(checkOutDate) },
        checkOutDate: { $gte: new Date(checkInDate) },
      },
    ],
  });

  if (existingReservation) {
    return next(new ErrorResponse('Room is not available for selected dates', 400));
  }

  // Create reservation
  const reservation = await Reservation.create({
    ...req.body,
    confirmedBy: req.user.id,
  });

  // Populate guest and room details
  await reservation.populate('guestId roomId');

  res.status(201).json({
    success: true,
    message: 'Reservation created successfully',
    data: reservation,
  });
});

/**
 * @desc    Get all reservations
 * @route   GET /api/reservations
 * @access  Private (Admin, Manager, Receptionist)
 */
exports.getReservations = asyncHandler(async (req, res, next) => {
  const { status, checkInDate, checkOutDate, guestId, page = 1, limit = 10 } = req.query;

  // Build query
  const query = {};
  
  if (status) query.bookingStatus = status;
  if (guestId) query.guestId = guestId;
  if (checkInDate || checkOutDate) {
    query.checkInDate = {};
    if (checkInDate) query.checkInDate.$gte = new Date(checkInDate);
    if (checkOutDate) query.checkInDate.$lte = new Date(checkOutDate);
  }

  // Execute query with pagination
  const reservations = await Reservation.find(query)
    .populate('guestId', 'name email phone')
    .populate('roomId', 'roomNumber roomType price')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort('-createdAt');

  const count = await Reservation.countDocuments(query);

  res.status(200).json({
    success: true,
    count: reservations.length,
    total: count,
    totalPages: Math.ceil(count / limit),
    currentPage: parseInt(page),
    data: reservations,
  });
});

/**
 * @desc    Get single reservation
 * @route   GET /api/reservations/:id
 * @access  Private
 */
exports.getReservation = asyncHandler(async (req, res, next) => {
  const reservation = await Reservation.findById(req.params.id)
    .populate('guestId', 'name email phone address')
    .populate('roomId');

  if (!reservation) {
    return next(new ErrorResponse('Reservation not found', 404));
  }

  res.status(200).json({
    success: true,
    data: reservation,
  });
});

/**
 * @desc    Update reservation
 * @route   PUT /api/reservations/:id
 * @access  Private (Admin, Manager, Receptionist)
 */
exports.updateReservation = asyncHandler(async (req, res, next) => {
  let reservation = await Reservation.findById(req.params.id);

  if (!reservation) {
    return next(new ErrorResponse('Reservation not found', 404));
  }

  reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate('guestId roomId');

  res.status(200).json({
    success: true,
    message: 'Reservation updated successfully',
    data: reservation,
  });
});

/**
 * @desc    Check-in guest
 * @route   PUT /api/reservations/:id/check-in
 * @access  Private (Admin, Manager, Receptionist)
 */
exports.checkIn = asyncHandler(async (req, res, next) => {
  const reservation = await Reservation.findById(req.params.id);

  if (!reservation) {
    return next(new ErrorResponse('Reservation not found', 404));
  }

  if (reservation.bookingStatus !== 'Confirmed') {
    return next(new ErrorResponse('Reservation must be confirmed before check-in', 400));
  }

  // Update reservation status
  reservation.bookingStatus = 'CheckedIn';
  await reservation.save();

  // Update room status
  await Room.findByIdAndUpdate(reservation.roomId, { status: 'Occupied' });

  res.status(200).json({
    success: true,
    message: 'Guest checked in successfully',
    data: reservation,
  });
});

/**
 * @desc    Check-out guest
 * @route   PUT /api/reservations/:id/check-out
 * @access  Private (Admin, Manager, Receptionist)
 */
exports.checkOut = asyncHandler(async (req, res, next) => {
  const reservation = await Reservation.findById(req.params.id);

  if (!reservation) {
    return next(new ErrorResponse('Reservation not found', 404));
  }

  if (reservation.bookingStatus !== 'CheckedIn') {
    return next(new ErrorResponse('Guest must be checked in before check-out', 400));
  }

  // Update reservation status
  reservation.bookingStatus = 'CheckedOut';
  await reservation.save();

  // Update room status to cleaning
  await Room.findByIdAndUpdate(reservation.roomId, { status: 'Cleaning' });

  res.status(200).json({
    success: true,
    message: 'Guest checked out successfully',
    data: reservation,
  });
});

/**
 * @desc    Cancel reservation
 * @route   PUT /api/reservations/:id/cancel
 * @access  Private
 */
exports.cancelReservation = asyncHandler(async (req, res, next) => {
  const reservation = await Reservation.findById(req.params.id);

  if (!reservation) {
    return next(new ErrorResponse('Reservation not found', 404));
  }

  if (reservation.bookingStatus === 'CheckedOut') {
    return next(new ErrorResponse('Cannot cancel completed reservation', 400));
  }

  // Update reservation
  reservation.bookingStatus = 'Cancelled';
  reservation.cancelledBy = req.user.id;
  reservation.cancellationReason = req.body.reason;
  reservation.cancelledAt = Date.now();
  await reservation.save();

  res.status(200).json({
    success: true,
    message: 'Reservation cancelled successfully',
    data: reservation,
  });
});

/**
 * @desc    Get my reservations (for guests)
 * @route   GET /api/reservations/my-bookings
 * @access  Private (Guest)
 */
exports.getMyReservations = asyncHandler(async (req, res, next) => {
  const reservations = await Reservation.find({ guestId: req.user.id })
    .populate('roomId', 'roomNumber roomType price')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: reservations.length,
    data: reservations,
  });
});