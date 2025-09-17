const { WebhookLog, OrderStatus, Order } = require('../models');

// Handle incoming webhook from payment gateway
const handleWebhook = async (req, res) => {
  try {
    const webhookPayload = req.body;
    
    console.log(`[INFO] Webhook received:`, JSON.stringify(webhookPayload, null, 2));

    // Log the webhook for auditing
    const webhookLog = new WebhookLog({
      payload: webhookPayload,
      status: 'processed' // Will be updated if processing fails
    });

    try {
      // Extract order information from webhook
      const { status: gatewayStatus, order_info } = webhookPayload;

      if (!order_info || !order_info.order_id) {
        throw new Error('Invalid webhook payload: missing order_id');
      }

      const {
        order_id: collect_id,
        order_amount,
        transaction_amount,
        gateway,
        bank_reference,
        status: transactionStatus,
        payment_mode,
        payemnt_details: payment_details, // Note: typo in original spec
        Payment_message: payment_message,
        payment_time,
        error_message
      } = order_info;

      // Add order_id to webhook log for easier tracking
      webhookLog.order_id = collect_id;

      // Verify that the order exists in our database
      const order = await Order.findById(collect_id);
      if (!order) {
        throw new Error(`Order with collect_id ${collect_id} not found`);
      }

      // Update or create order status
      const updateData = {
        collect_id,
        order_amount: order_amount || 0,
        transaction_amount: transaction_amount || order_amount || 0,
        payment_mode,
        payment_details,
        bank_reference,
        payment_message,
        status: transactionStatus || 'pending',
        error_message: error_message && error_message !== 'NA' ? error_message : null,
        payment_time: payment_time ? new Date(payment_time) : null
      };

      // Remove undefined/null values
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined || updateData[key] === null) {
          delete updateData[key];
        }
      });

      const updatedOrderStatus = await OrderStatus.findOneAndUpdate(
        { collect_id },
        updateData,
        { 
          new: true, 
          upsert: true,
          runValidators: true
        }
      );

      console.log(`[INFO] Order status updated for collect_id: ${collect_id}, status: ${transactionStatus}`);

      // Save successful webhook log
      await webhookLog.save();

      // Send success response to payment gateway
      res.status(200).json({
        message: 'Webhook processed successfully',
        collect_id
      });

    } catch (processingError) {
      console.error('[ERROR] Webhook processing error:', processingError.message);
      
      // Update webhook log with error
      webhookLog.status = 'failed';
      webhookLog.processing_error = processingError.message;
      await webhookLog.save();

      // Still send 200 to prevent gateway retries for invalid data
      res.status(200).json({
        message: 'Webhook received but processing failed',
        error: processingError.message
      });
    }

  } catch (error) {
    console.error('[ERROR] Webhook handler error:', error);
    
    // For system errors, return 500 so gateway can retry
    res.status(500).json({
      message: 'Internal server error processing webhook'
    });
  }
};

// Get webhook logs (useful for debugging)
const getWebhookLogs = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status,
      order_id,
      startDate,
      endDate
    } = req.query;

    const filter = {};
    
    if (status) filter.status = status;
    if (order_id) filter.order_id = order_id;
    if (startDate || endDate) {
      filter.received_at = {};
      if (startDate) filter.received_at.$gte = new Date(startDate);
      if (endDate) filter.received_at.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const webhookLogs = await WebhookLog.find(filter)
      .sort({ received_at: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await WebhookLog.countDocuments(filter);

    res.status(200).json({
      data: webhookLogs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('[ERROR] Get webhook logs error:', error);
    res.status(500).json({
      message: 'Internal server error retrieving webhook logs'
    });
  }
};

module.exports = {
  handleWebhook,
  getWebhookLogs
};