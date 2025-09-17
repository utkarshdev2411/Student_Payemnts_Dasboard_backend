const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  school_id: {
    type: String,
    required: [true, 'School ID is required'],
    trim: true
  },
  trustee_id: {
    type: String,
    trim: true
  },
  student_info: {
    name: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true
    },
    id: {
      type: String,
      required: [true, 'Student ID is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Student email is required'],
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    }
  },
  gateway_name: {
    type: String,
    trim: true,
    default: 'PhonePe'
  }
}, {
  timestamps: true
});

// Index for better query performance
orderSchema.index({ school_id: 1 });
orderSchema.index({ 'student_info.id': 1 });
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);