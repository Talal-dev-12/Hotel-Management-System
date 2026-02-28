const Joi = require('joi');

/**
 * Create Reservation Validation Schema
 * ✅ FIXED: guestId is optional - will be populated by controller with req.user.id
 */
const createReservationSchema = Joi.object({
  // ✅ OPTIONAL - Controller will use req.user.id if empty
  guestId: Joi.string().optional().allow('').allow(null),
  
  // ✅ REQUIRED
  roomId: Joi.string().required().messages({
    'any.required': 'Room ID is required',
    'string.empty': 'Room ID cannot be empty'
  }),
  
  checkInDate: Joi.date().required().messages({
    'any.required': 'Check-in date is required',
    'date.base': 'Check-in date must be a valid date'
  }),
  
  checkOutDate: Joi.date().required().messages({
    'any.required': 'Check-out date is required',
    'date.base': 'Check-out date must be a valid date'
  }),
  
  // ✅ REQUIRED with nested validation
  numberOfGuests: Joi.object({
    adults: Joi.number().required().min(1).messages({
      'number.base': 'Adults must be a number',
      'number.min': 'At least 1 adult is required'
    }),
    children: Joi.number().optional().default(0).min(0).messages({
      'number.base': 'Children must be a number',
      'number.min': 'Children count cannot be negative'
    })
  }).required().messages({
    'any.required': 'Number of guests is required'
  }),
  
  // ✅ REQUIRED
  totalAmount: Joi.number().required().min(0).messages({
    'any.required': 'Total amount is required',
    'number.base': 'Total amount must be a number',
    'number.min': 'Total amount cannot be negative'
  }),
  
  // ✅ OPTIONAL - Defaults to 0
  advancePayment: Joi.number().optional().default(0).min(0).messages({
    'number.base': 'Advance payment must be a number',
    'number.min': 'Advance payment cannot be negative'
  }),
  
  // ✅ OPTIONAL - Allow empty string
  specialRequests: Joi.string().optional().allow('').messages({
    'string.base': 'Special requests must be a string'
  }),
  
  // ✅ OPTIONAL - Must be from valid list
  bookingSource: Joi.string()
    .valid('Website', 'Phone', 'Walk-in', 'Travel Agency', 'OTA')
    .optional()
    .default('Website')
    .messages({
      'any.only': 'Booking source must be one of: Website, Phone, Walk-in, Travel Agency, OTA'
    }),
  
  // ✅ OPTIONAL - These are sent from frontend but not critical for validation
  guestName: Joi.string().optional().allow(''),
  guestEmail: Joi.string().optional().allow(''),
  guestPhone: Joi.string().optional().allow('')
})
  .unknown(true) // ✅ IMPORTANT: Allow unknown fields from frontend
  .messages({
    'object.unknown': 'Unexpected field in request'
  });

/**
 * Update Reservation Validation Schema
 */
const updateReservationSchema = Joi.object({
  guestId: Joi.string().optional(),
  
  roomId: Joi.string().optional(),
  
  checkInDate: Joi.date().optional(),
  
  checkOutDate: Joi.date().optional(),
  
  numberOfGuests: Joi.object({
    adults: Joi.number().optional().min(1),
    children: Joi.number().optional().min(0)
  }).optional(),
  
  totalAmount: Joi.number().optional().min(0),
  
  advancePayment: Joi.number().optional().min(0),
  
  specialRequests: Joi.string().optional().allow(''),
  
  bookingSource: Joi.string()
    .valid('Website', 'Phone', 'Walk-in', 'Travel Agency', 'OTA')
    .optional(),
  
  bookingStatus: Joi.string()
    .valid('Confirmed', 'Pending', 'CheckedIn', 'CheckedOut', 'Cancelled')
    .optional()
})
  .min(1) // At least one field must be provided for update
  .unknown(true); // ✅ Allow unknown fields

/**
 * Check Availability Validation Schema
 */
const checkAvailabilitySchema = Joi.object({
  checkInDate: Joi.date().required().messages({
    'any.required': 'Check-in date is required',
    'date.base': 'Check-in date must be a valid date'
  }),
  
  checkOutDate: Joi.date().required().messages({
    'any.required': 'Check-out date is required',
    'date.base': 'Check-out date must be a valid date'
  }),
  
  roomType: Joi.string()
    .valid('Single', 'Double', 'Suite', 'Deluxe', 'Presidential')
    .optional()
    .messages({
      'any.only': 'Room type must be one of: Single, Double, Suite, Deluxe, Presidential'
    })
})
  .unknown(true); // ✅ Allow unknown fields

module.exports = {
  createReservationSchema,
  updateReservationSchema,
  checkAvailabilitySchema
};