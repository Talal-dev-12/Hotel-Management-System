const mongoose = require('mongoose');

/**
 * Feedback Schema
 * Manages guest feedback and reviews
 */
const feedbackSchema = new mongoose.Schema(
  {
    guestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Guest ID is required'],
    },
    reservationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reservation',
    },
    rating: {
      overall: {
        type: Number,
        required: [true, 'Overall rating is required'],
        min: 1,
        max: 5,
      },
      cleanliness: {
        type: Number,
        min: 1,
        max: 5,
      },
      service: {
        type: Number,
        min: 1,
        max: 5,
      },
      amenities: {
        type: Number,
        min: 1,
        max: 5,
      },
      valueForMoney: {
        type: Number,
        min: 1,
        max: 5,
      },
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },
    improvements: {
      type: String,
      trim: true,
    },
    wouldRecommend: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Reviewed', 'Published'],
      default: 'Pending',
    },
    response: {
      message: {
        type: String,
      },
      respondedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      respondedAt: {
        type: Date,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
feedbackSchema.index({ guestId: 1 });
feedbackSchema.index({ 'rating.overall': -1 });
feedbackSchema.index({ status: 1 });

module.exports = mongoose.model('Feedback', feedbackSchema);