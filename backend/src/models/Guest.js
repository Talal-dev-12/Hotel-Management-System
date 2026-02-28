const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema(
  {
    // Personal Information
    name: {
      type: String,
      required: [true, 'Please provide guest name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters']
    },

    email: {
      type: String,
      required: [true, 'Please provide email'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email'
      ]
    },

    phone: {
      type: String,
      required: [true, 'Please provide phone number'],
      match: [
        /^[\+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/,
        'Please provide a valid phone number'
      ]
    },

    // Address Information
    address: {
      street: {
        type: String,
        trim: true
      },
      city: {
        type: String,
        trim: true
      },
      state: {
        type: String,
        trim: true
      },
      zipCode: {
        type: String,
        trim: true
      },
      country: {
        type: String,
        trim: true
      }
    },

    // Additional Information
    idType: {
      type: String,
      enum: ['Passport', 'Driving License', 'National ID', 'Visa', 'Other'],
      default: 'Passport'
    },

    idNumber: {
      type: String,
      trim: true
    },

    nationality: {
      type: String,
      trim: true
    },

    // Guest Type
    guestType: {
      type: String,
      enum: ['Individual', 'Corporate', 'Family'],
      default: 'Individual'
    },

    // Preferences
    preferences: {
      roomType: {
        type: String,
        enum: ['Single', 'Double', 'Suite', 'Deluxe', 'Presidential'],
        default: 'Double'
      },
      bedType: {
        type: String,
        enum: ['Single', 'Double', 'Queen', 'King'],
        default: 'Double'
      },
      floorPreference: String,
      specialRequests: String
    },

    // Contact Preferences
    contactPreference: {
      type: String,
      enum: ['Email', 'Phone', 'SMS'],
      default: 'Email'
    },

    // Guest Status
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'VIP', 'Blacklisted'],
      default: 'Active'
    },

    // Reservation History
    totalReservations: {
      type: Number,
      default: 0
    },

    totalNights: {
      type: Number,
      default: 0
    },

    totalSpent: {
      type: Number,
      default: 0
    },

    lastVisit: Date,

    // Loyalty Program
    loyaltyPoints: {
      type: Number,
      default: 0
    },

    membershipLevel: {
      type: String,
      enum: ['Bronze', 'Silver', 'Gold', 'Platinum'],
      default: 'Bronze'
    },

    // Company Information (for corporate guests)
    companyName: String,
    companyEmail: String,
    companyPhone: String,
    companyAddress: String,

    // Emergency Contact
    emergencyContact: {
      name: String,
      relationship: String,
      phone: String
    },

    // Notes
    notes: String,

    // Source of Booking
    bookingSource: {
      type: String,
      enum: ['Website', 'Phone', 'Walk-in', 'Travel Agency', 'OTA'],
      default: 'Website'
    },

    // Marketing
    newsletter: {
      type: Boolean,
      default: true
    },

    promotions: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for faster queries
guestSchema.index({ email: 1 });
guestSchema.index({ phone: 1 });
guestSchema.index({ name: 1 });
guestSchema.index({ status: 1 });

// Virtual for full address
guestSchema.virtual('fullAddress').get(function() {
  if (this.address) {
    return `${this.address.street}, ${this.address.city}, ${this.address.state} ${this.address.zipCode}, ${this.address.country}`;
  }
  return null;
});

// Pre-save middleware to ensure email is lowercase
guestSchema.pre('save', function(next) {
  if (this.email) {
    this.email = this.email.toLowerCase();
  }
  next();
});

// Method to update guest stats after reservation
guestSchema.methods.updateStatsAfterReservation = function(nights, amount) {
  this.totalReservations += 1;
  this.totalNights += nights;
  this.totalSpent += amount;
  this.lastVisit = new Date();
  
  // Update membership level based on total spent
  if (this.totalSpent > 10000) {
    this.membershipLevel = 'Platinum';
  } else if (this.totalSpent > 5000) {
    this.membershipLevel = 'Gold';
  } else if (this.totalSpent > 2000) {
    this.membershipLevel = 'Silver';
  }
  
  return this.save();
};

module.exports = mongoose.model('Guest', guestSchema);