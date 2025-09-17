const mongoose = require('mongoose');

const orderStatusSchema = new mongoose.Schema({
  collect_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Collect ID is required'],
    ref: 'Order',
    unique: true
  },
  order_amount: {
    type: Number,
    required: [true, 'Order amount is required'],
    min: [0, 'Order amount cannot be negative']
  },
  transaction_amount: {
    type: Number,
    min: [0, 'Transaction amount cannot be negative']
  },
  payment_mode: {
    type: String,
    enum: ['upi', 'card', 'netbanking', 'wallet', 'other'],
    trim: true
  },
  payment_details: {
    type: String,
    trim: true
  },
  bank_reference: {
    type: String,
    trim: true
  },
  payment_message: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: ['pending', 'success', 'failed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  error_message: {
    type: String,
    trim: true
  },
  payment_time: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for better query performance
orderStatusSchema.index({ collect_id: 1 });
orderStatusSchema.index({ status: 1 });
orderStatusSchema.index({ payment_time: -1 });
orderStatusSchema.index({ createdAt: -1 });

module.exports = mongoose.model('OrderStatus', orderStatusSchema);