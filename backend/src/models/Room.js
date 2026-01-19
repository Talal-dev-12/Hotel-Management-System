const mongoose = require('mongoose');

/**
 * Room Schema
 * Manages hotel room inventory
 */
const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: [true, 'Please provide a room number'],
      unique: true,
      trim: true,
    },
    roomType: {
      type: String,
      required: [true, 'Please specify room type'],
      enum: ['Single', 'Double', 'Suite', 'Deluxe', 'Presidential'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide room price'],
      min: [0, 'Price cannot be negative'],
    },
    status: {
      type: String,
      enum: ['Available', 'Occupied', 'Cleaning', 'Maintenance'],
      default: 'Available',
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    amenities: [{
      type: String,
      trim: true,
    }],
    capacity: {
      adults: {
        type: Number,
        default: 2,
        min: 1,
      },
      children: {
        type: Number,
        default: 1,
        min: 0,
      },
    },
    floor: {
      type: Number,
      required: true,
    },
    images: [{
      type: String,
    }],
    bedType: {
      type: String,
      enum: ['Single', 'Double', 'Queen', 'King'],
    },
    size: {
      type: Number,
      comment: 'Room size in square feet',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
roomSchema.index({ status: 1, roomType: 1 });
roomSchema.index({ roomNumber: 1 });

// Virtual for checking availability
roomSchema.virtual('isAvailable').get(function () {
  return this.status === 'Available';
});

module.exports = mongoose.model('Room', roomSchema);