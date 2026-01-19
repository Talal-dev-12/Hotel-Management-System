const Invoice = require('../models/Invoice');
const Reservation = require('../models/Reservation');
const Room = require('../models/Room');
const asyncHandler = require('../middlewares/asyncHandler');
const { ErrorResponse } = require('../utils/errorResponse');

/**
 * @desc    Generate invoice
 * @route   POST /api/invoices
 * @access  Private (Admin, Manager, Receptionist)
 */
exports.generateInvoice = asyncHandler(async (req, res, next) => {
  const { reservationId, serviceCharges, taxes, discount } = req.body;

  // Get reservation details
  const reservation = await Reservation.findById(reservationId).populate('roomId');

  if (!reservation) {
    return next(new ErrorResponse('Reservation not found', 404));
  }

  // Calculate room charges
  const roomCharges = reservation.totalAmount;

  // Calculate service charges total
  let serviceTotal = 0;
  if (serviceCharges && serviceCharges.length > 0) {
    serviceTotal = serviceCharges.reduce((sum, service) => {
      return sum + (service.amount * service.quantity);
    }, 0);
  }

  // Calculate taxes
  const taxTotal = (taxes?.gst || 0) + (taxes?.serviceTax || 0) + (taxes?.other || 0);

  // Calculate total amount
  const totalAmount = roomCharges + serviceTotal + taxTotal - (discount || 0);

  // Create invoice
  const invoice = await Invoice.create({
    reservationId,
    guestId: reservation.guestId,
    roomCharges,
    serviceCharges: serviceCharges || [],
    taxes: taxes || {},
    discount: discount || 0,
    totalAmount,
    generatedBy: req.user.id,
  });

  await invoice.populate('guestId reservationId');

  res.status(201).json({
    success: true,
    message: 'Invoice generated successfully',
    data: invoice,
  });
});

/**
 * @desc    Get all invoices
 * @route   GET /api/invoices
 * @access  Private (Admin, Manager, Receptionist)
 */
exports.getInvoices = asyncHandler(async (req, res, next) => {
  const { paymentStatus, guestId, page = 1, limit = 10 } = req.query;

  // Build query
  const query = {};
  
  if (paymentStatus) query.paymentStatus = paymentStatus;
  if (guestId) query.guestId = guestId;

  // Execute query with pagination
  const invoices = await Invoice.find(query)
    .populate('guestId', 'name email phone')
    .populate('reservationId')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort('-createdAt');

  const count = await Invoice.countDocuments(query);

  res.status(200).json({
    success: true,
    count: invoices.length,
    total: count,
    totalPages: Math.ceil(count / limit),
    currentPage: parseInt(page),
    data: invoices,
  });
});

/**
 * @desc    Get single invoice
 * @route   GET /api/invoices/:id
 * @access  Private
 */
exports.getInvoice = asyncHandler(async (req, res, next) => {
  const invoice = await Invoice.findById(req.params.id)
    .populate('guestId', 'name email phone address')
    .populate({
      path: 'reservationId',
      populate: { path: 'roomId' }
    });

  if (!invoice) {
    return next(new ErrorResponse('Invoice not found', 404));
  }

  res.status(200).json({
    success: true,
    data: invoice,
  });
});

/**
 * @desc    Get invoice by reservation
 * @route   GET /api/invoices/reservation/:reservationId
 * @access  Private
 */
exports.getInvoiceByReservation = asyncHandler(async (req, res, next) => {
  const invoice = await Invoice.findOne({ reservationId: req.params.reservationId })
    .populate('guestId reservationId');

  if (!invoice) {
    return next(new ErrorResponse('Invoice not found for this reservation', 404));
  }

  res.status(200).json({
    success: true,
    data: invoice,
  });
});

/**
 * @desc    Update payment status
 * @route   PUT /api/invoices/:id/payment
 * @access  Private (Admin, Manager, Receptionist)
 */
exports.updatePayment = asyncHandler(async (req, res, next) => {
  const { amountPaid, paymentMethod } = req.body;

  const invoice = await Invoice.findById(req.params.id);

  if (!invoice) {
    return next(new ErrorResponse('Invoice not found', 404));
  }

  invoice.amountPaid = amountPaid;
  invoice.paymentMethod = paymentMethod;
  invoice.paymentDate = Date.now();
  
  await invoice.save();

  res.status(200).json({
    success: true,
    message: 'Payment updated successfully',
    data: invoice,
  });
});

/**
 * @desc    Get my invoices (for guests)
 * @route   GET /api/invoices/my-invoices
 * @access  Private (Guest)
 */
exports.getMyInvoices = asyncHandler(async (req, res, next) => {
  const invoices = await Invoice.find({ guestId: req.user.id })
    .populate('reservationId')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: invoices.length,
    data: invoices,
  });
});