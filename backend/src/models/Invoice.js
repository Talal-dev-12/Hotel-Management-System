const mongoose = require('mongoose');

/**
 * Invoice Schema
 * Manages billing and payments
 */
const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    reservationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reservation',
      required: [true, 'Reservation ID is required'],
    },
    guestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Guest ID is required'],
    },
    roomCharges: {
      type: Number,
      required: true,
      min: 0,
    },
    serviceCharges: [{
      serviceName: {
        type: String,
        required: true,
      },
      amount: {
        type: Number,
        required: true,
        min: 0,
      },
      quantity: {
        type: Number,
        default: 1,
        min: 1,
      },
    }],
    taxes: {
      gst: {
        type: Number,
        default: 0,
      },
      serviceTax: {
        type: Number,
        default: 0,
      },
      other: {
        type: Number,
        default: 0,
      },
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    amountPaid: {
      type: Number,
      default: 0,
      min: 0,
    },
    balanceAmount: {
      type: Number,
      default: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['Unpaid', 'Partially Paid', 'Paid', 'Refunded'],
      default: 'Unpaid',
    },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Card', 'UPI', 'Net Banking', 'Cheque'],
    },
    paymentDate: {
      type: Date,
    },
    notes: {
      type: String,
    },
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate invoice number
invoiceSchema.pre('save', async function (next) {
  if (!this.invoiceNumber) {
    const count = await mongoose.model('Invoice').countDocuments();
    const year = new Date().getFullYear();
    this.invoiceNumber = `INV${year}${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Calculate balance amount
invoiceSchema.pre('save', function (next) {
  this.balanceAmount = this.totalAmount - this.amountPaid;
  
  // Update payment status
  if (this.amountPaid === 0) {
    this.paymentStatus = 'Unpaid';
  } else if (this.amountPaid < this.totalAmount) {
    this.paymentStatus = 'Partially Paid';
  } else if (this.amountPaid >= this.totalAmount) {
    this.paymentStatus = 'Paid';
  }
  
  next();
});

// Index for faster queries
invoiceSchema.index({ invoiceNumber: 1 });
invoiceSchema.index({ reservationId: 1 });
invoiceSchema.index({ guestId: 1 });

module.exports = mongoose.model('Invoice', invoiceSchema);