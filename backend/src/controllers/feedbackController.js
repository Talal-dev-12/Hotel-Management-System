const Feedback = require('../models/Feedback');
const Reservation = require('../models/Reservation');
const asyncHandler = require('../middlewares/asyncHandler');
const { ErrorResponse } = require('../utils/errorResponse');

/**
 * @desc    Submit feedback
 * @route   POST /api/feedback
 * @access  Private (Guest)
 */
exports.submitFeedback = asyncHandler(async (req, res, next) => {
  const { reservationId } = req.body;

  // Verify reservation exists and belongs to guest
  if (reservationId) {
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return next(new ErrorResponse('Reservation not found', 404));
    }

    if (reservation.guestId.toString() !== req.user.id) {
      return next(new ErrorResponse('Not authorized to provide feedback for this reservation', 403));
    }
  }

  // Create feedback
  const feedback = await Feedback.create({
    ...req.body,
    guestId: req.user.id,
  });

  await feedback.populate('guestId', 'name email');

  res.status(201).json({
    success: true,
    message: 'Feedback submitted successfully',
    data: feedback,
  });
});

/**
 * @desc    Get all feedback
 * @route   GET /api/feedback
 * @access  Private (Admin, Manager)
 */
exports.getAllFeedback = asyncHandler(async (req, res, next) => {
  const { status, minRating, maxRating, page = 1, limit = 10 } = req.query;

  // Build query
  const query = {};
  
  if (status) query.status = status;
  if (minRating || maxRating) {
    query['rating.overall'] = {};
    if (minRating) query['rating.overall'].$gte = parseFloat(minRating);
    if (maxRating) query['rating.overall'].$lte = parseFloat(maxRating);
  }

  // Execute query with pagination
  const feedbacks = await Feedback.find(query)
    .populate('guestId', 'name email')
    .populate('reservationId')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort('-createdAt');

  const count = await Feedback.countDocuments(query);

  res.status(200).json({
    success: true,
    count: feedbacks.length,
    total: count,
    totalPages: Math.ceil(count / limit),
    currentPage: parseInt(page),
    data: feedbacks,
  });
});

/**
 * @desc    Get single feedback
 * @route   GET /api/feedback/:id
 * @access  Private
 */
exports.getFeedback = asyncHandler(async (req, res, next) => {
  const feedback = await Feedback.findById(req.params.id)
    .populate('guestId', 'name email phone')
    .populate('reservationId');

  if (!feedback) {
    return next(new ErrorResponse('Feedback not found', 404));
  }

  res.status(200).json({
    success: true,
    data: feedback,
  });
});

/**
 * @desc    Respond to feedback
 * @route   PUT /api/feedback/:id/respond
 * @access  Private (Admin, Manager)
 */
exports.respondToFeedback = asyncHandler(async (req, res, next) => {
  const { message } = req.body;

  if (!message) {
    return next(new ErrorResponse('Please provide a response message', 400));
  }

  const feedback = await Feedback.findByIdAndUpdate(
    req.params.id,
    {
      response: {
        message,
        respondedBy: req.user.id,
        respondedAt: Date.now(),
      },
      status: 'Reviewed',
    },
    { new: true }
  ).populate('guestId response.respondedBy');

  if (!feedback) {
    return next(new ErrorResponse('Feedback not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Response submitted successfully',
    data: feedback,
  });
});

/**
 * @desc    Update feedback status
 * @route   PUT /api/feedback/:id/status
 * @access  Private (Admin, Manager)
 */
exports.updateFeedbackStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;

  const feedback = await Feedback.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (!feedback) {
    return next(new ErrorResponse('Feedback not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Feedback status updated successfully',
    data: feedback,
  });
});

/**
 * @desc    Get my feedback
 * @route   GET /api/feedback/my-feedback
 * @access  Private (Guest)
 */
exports.getMyFeedback = asyncHandler(async (req, res, next) => {
  const feedbacks = await Feedback.find({ guestId: req.user.id })
    .populate('reservationId')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: feedbacks.length,
    data: feedbacks,
  });
});

/**
 * @desc    Get feedback statistics
 * @route   GET /api/feedback/stats
 * @access  Private (Admin, Manager)
 */
exports.getFeedbackStats = asyncHandler(async (req, res, next) => {
  const stats = await Feedback.aggregate([
    {
      $group: {
        _id: null,
        averageOverall: { $avg: '$rating.overall' },
        averageCleanliness: { $avg: '$rating.cleanliness' },
        averageService: { $avg: '$rating.service' },
        averageAmenities: { $avg: '$rating.amenities' },
        averageValueForMoney: { $avg: '$rating.valueForMoney' },
        totalFeedbacks: { $sum: 1 },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    data: stats[0] || {},
  });
});