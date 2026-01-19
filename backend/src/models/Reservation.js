const mongoose = require('mongoose');

/**
 * Reservation Schema
 * Manages room bookings
 */
const reservationSchema = new mongoose.Schema(
  {
    guestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Guest ID is required'],
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: [true, 'Room ID is required'],
    },
    checkInDate: {
      type: Date,
      required: [true, 'Check-in date is required'],
    },
    checkOutDate: {
      type: Date,
      required: [true, 'Check-out date is required'],
    },
    numberOfGuests: {
      adults: {
        type: Number,
        required: true,
        min: 1,
      },
      children: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    bookingStatus: {
      type: String,
      enum: ['Pending', 'Confirmed', 'CheckedIn', 'CheckedOut', 'Cancelled'],
      default: 'Pending',
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    advancePayment: {
      type: Number,
      default: 0,
      min: 0,
    },
    specialRequests: {
      type: String,
      trim: true,
    },
    bookingSource: {
      type: String,
      enum: ['Website', 'Phone', 'Walk-in', 'Travel Agency', 'OTA'],
      default: 'Website',
    },
    confirmedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    cancellationReason: {
      type: String,
    },
    cancelledAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Validate check-out date is after check-in date
reservationSchema.pre('validate', function (next) {
  if (this.checkOutDate <= this.checkInDate) {
    next(new Error('Check-out date must be after check-in date'));
  }
  next();
});

// Calculate number of nights
reservationSchema.virtual('numberOfNights').get(function () {
  const diffTime = Math.abs(this.checkOutDate - this.checkInDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Index for faster queries
reservationSchema.index({ guestId: 1, bookingStatus: 1 });
reservationSchema.index({ roomId: 1, checkInDate: 1, checkOutDate: 1 });
reservationSchema.index({ bookingStatus: 1, checkInDate: 1 });

module.exports = mongoose.model('Reservation', reservationSchema);