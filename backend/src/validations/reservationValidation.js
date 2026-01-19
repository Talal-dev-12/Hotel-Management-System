const Joi = require('joi');

/**
 * Validation schemas for reservations
 */

// Create reservation validation
exports.createReservationSchema = Joi.object({
  guestId: Joi.string().required(),
  roomId: Joi.string().required(),
  checkInDate: Joi.date().iso().min('now').required().messages({
    'date.min': 'Check-in date cannot be in the past',
  }),
  checkOutDate: Joi.date().iso().greater(Joi.ref('checkInDate')).required().messages({
    'date.greater': 'Check-out date must be after check-in date',
  }),
  numberOfGuests: Joi.object({
    adults: Joi.number().integer().min(1).required(),
    children: Joi.number().integer().min(0).default(0),
  }).required(),
  totalAmount: Joi.number().min(0).required(),
  advancePayment: Joi.number().min(0).default(0),
  specialRequests: Joi.string().allow(''),
  bookingSource: Joi.string().valid('Website', 'Phone', 'Walk-in', 'Travel Agency', 'OTA').default('Website'),
});

// Update reservation validation
exports.updateReservationSchema = Joi.object({
  checkInDate: Joi.date().iso(),
  checkOutDate: Joi.date().iso(),
  numberOfGuests: Joi.object({
    adults: Joi.number().integer().min(1),
    children: Joi.number().integer().min(0),
  }),
  specialRequests: Joi.string().allow(''),
  bookingStatus: Joi.string().valid('Pending', 'Confirmed', 'CheckedIn', 'CheckedOut', 'Cancelled'),
});

// Check availability validation
exports.checkAvailabilitySchema = Joi.object({
  checkInDate: Joi.date().iso().required(),
  checkOutDate: Joi.date().iso().greater(Joi.ref('checkInDate')).required(),
  roomType: Joi.string().valid('Single', 'Double', 'Suite', 'Deluxe', 'Presidential'),
});