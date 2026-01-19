const Reservation = require('../models/Reservation');
const Invoice = require('../models/Invoice');
const Room = require('../models/Room');
const asyncHandler = require('../middlewares/asyncHandler');

/**
 * @desc    Get occupancy report
 * @route   GET /api/reports/occupancy
 * @access  Private (Admin, Manager)
 */
exports.getOccupancyReport = asyncHandler(async (req, res, next) => {
  const { startDate, endDate } = req.query;

  const query = {
    bookingStatus: { $in: ['Confirmed', 'CheckedIn', 'CheckedOut'] },
  };

  if (startDate && endDate) {
    query.checkInDate = { $gte: new Date(startDate) };
    query.checkOutDate = { $lte: new Date(endDate) };
  }

  // Get total rooms
  const totalRooms = await Room.countDocuments({ isActive: true });

  // Get occupied rooms count
  const occupiedRooms = await Reservation.find({
    bookingStatus: 'CheckedIn',
  }).countDocuments();

  // Get reservations in date range
  const reservations = await Reservation.find(query);

  // Calculate total room nights
  let totalRoomNights = 0;
  reservations.forEach(reservation => {
    const nights = Math.ceil(
      (reservation.checkOutDate - reservation.checkInDate) / (1000 * 60 * 60 * 24)
    );
    totalRoomNights += nights;
  });

  // Calculate days in range
  const days = startDate && endDate
    ? Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))
    : 30;

  // Calculate occupancy rate
  const occupancyRate = totalRooms > 0
    ? ((totalRoomNights / (totalRooms * days)) * 100).toFixed(2)
    : 0;

  res.status(200).json({
    success: true,
    data: {
      totalRooms,
      occupiedRooms,
      availableRooms: totalRooms - occupiedRooms,
      totalReservations: reservations.length,
      totalRoomNights,
      occupancyRate: parseFloat(occupancyRate),
      period: {
        startDate: startDate || 'N/A',
        endDate: endDate || 'N/A',
        days,
      },
    },
  });
});

/**
 * @desc    Get revenue report
 * @route   GET /api/reports/revenue
 * @access  Private (Admin, Manager)
 */
exports.getRevenueReport = asyncHandler(async (req, res, next) => {
  const { startDate, endDate, groupBy = 'day' } = req.query;

  const matchQuery = {};

  if (startDate && endDate) {
    matchQuery.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  // Total revenue
  const totalRevenue = await Invoice.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: null,
        total: { $sum: '$totalAmount' },
        paid: { $sum: '$amountPaid' },
        pending: { $sum: '$balanceAmount' },
      },
    },
  ]);

  // Revenue by payment status
  const revenueByStatus = await Invoice.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: '$paymentStatus',
        total: { $sum: '$totalAmount' },
        count: { $sum: 1 },
      },
    },
  ]);

  // Revenue by payment method
  const revenueByMethod = await Invoice.aggregate([
    { $match: { ...matchQuery, paymentStatus: 'Paid' } },
    {
      $group: {
        _id: '$paymentMethod',
        total: { $sum: '$totalAmount' },
        count: { $sum: 1 },
      },
    },
  ]);

  // Group by date format based on groupBy parameter
  let dateGroupFormat;
  switch (groupBy) {
    case 'month':
      dateGroupFormat = { $dateToString: { format: '%Y-%m', date: '$createdAt' } };
      break;
    case 'year':
      dateGroupFormat = { $dateToString: { format: '%Y', date: '$createdAt' } };
      break;
    default:
      dateGroupFormat = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
  }

  // Revenue over time
  const revenueOverTime = await Invoice.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: dateGroupFormat,
        revenue: { $sum: '$totalAmount' },
        invoices: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.status(200).json({
    success: true,
    data: {
      summary: totalRevenue[0] || { total: 0, paid: 0, pending: 0 },
      byStatus: revenueByStatus,
      byPaymentMethod: revenueByMethod,
      overTime: revenueOverTime,
      period: {
        startDate: startDate || 'N/A',
        endDate: endDate || 'N/A',
      },
    },
  });
});

/**
 * @desc    Get booking statistics
 * @route   GET /api/reports/bookings
 * @access  Private (Admin, Manager)
 */
exports.getBookingStats = asyncHandler(async (req, res, next) => {
  const { startDate, endDate } = req.query;

  const matchQuery = {};

  if (startDate && endDate) {
    matchQuery.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  // Bookings by status
  const bookingsByStatus = await Reservation.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: '$bookingStatus',
        count: { $sum: 1 },
      },
    },
  ]);

  // Bookings by room type
  const bookingsByRoomType = await Reservation.aggregate([
    { $match: matchQuery },
    {
      $lookup: {
        from: 'rooms',
        localField: 'roomId',
        foreignField: '_id',
        as: 'room',
      },
    },
    { $unwind: '$room' },
    {
      $group: {
        _id: '$room.roomType',
        count: { $sum: 1 },
        revenue: { $sum: '$totalAmount' },
      },
    },
  ]);

  // Bookings by source
  const bookingsBySource = await Reservation.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: '$bookingSource',
        count: { $sum: 1 },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    data: {
      byStatus: bookingsByStatus,
      byRoomType: bookingsByRoomType,
      bySource: bookingsBySource,
      period: {
        startDate: startDate || 'N/A',
        endDate: endDate || 'N/A',
      },
    },
  });
});

/**
 * @desc    Get dashboard summary
 * @route   GET /api/reports/dashboard
 * @access  Private (Admin, Manager)
 */
exports.getDashboardSummary = asyncHandler(async (req, res, next) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Today's check-ins
  const todayCheckIns = await Reservation.countDocuments({
    checkInDate: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) },
    bookingStatus: { $in: ['Confirmed', 'CheckedIn'] },
  });

  // Today's check-outs
  const todayCheckOuts = await Reservation.countDocuments({
    checkOutDate: { $gte: today, $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) },
    bookingStatus: 'CheckedIn',
  });

  // Current occupancy
  const occupiedRooms = await Reservation.countDocuments({
    bookingStatus: 'CheckedIn',
  });

  const totalRooms = await Room.countDocuments({ isActive: true });

  // Pending tasks
  const Task = require('../models/Task');
  const pendingTasks = await Task.countDocuments({
    status: { $in: ['Pending', 'In Progress'] },
  });

  // Revenue this month
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthRevenue = await Invoice.aggregate([
    {
      $match: {
        createdAt: { $gte: firstDayOfMonth },
        paymentStatus: 'Paid',
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$totalAmount' },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    data: {
      todayCheckIns,
      todayCheckOuts,
      occupancy: {
        occupied: occupiedRooms,
        total: totalRooms,
        available: totalRooms - occupiedRooms,
        rate: totalRooms > 0 ? ((occupiedRooms / totalRooms) * 100).toFixed(2) : 0,
      },
      pendingTasks,
      monthRevenue: monthRevenue[0]?.total || 0,
    },
  });
});