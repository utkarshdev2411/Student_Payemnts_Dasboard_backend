const mongoose = require('mongoose');

const webhookLogSchema = new mongoose.Schema({
  received_at: {
    type: Date,
    default: Date.now
  },
  payload: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, 'Payload is required']
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    enum: ['processed', 'failed'],
    default: 'processed'
  },
  processing_error: {
    type: String,
    trim: true
  },
  order_id: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for better query performance
webhookLogSchema.index({ received_at: -1 });
webhookLogSchema.index({ status: 1 });
webhookLogSchema.index({ order_id: 1 });

module.exports = mongoose.model('WebhookLog', webhookLogSchema);