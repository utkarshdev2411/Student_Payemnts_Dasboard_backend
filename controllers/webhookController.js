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

      console.log(`[INFO] Gateway status: ${gatewayStatus}`);
      console.log(`[INFO] Order info:`, JSON.stringify(order_info, null, 2));

      const {
        order_id: collect_id,
        order_amount,
        transaction_amount,
        gateway,
        bank_reference,
        status: transactionStatus,
        payment_mode,
        payemnt_details: payment_details,
        Payment_message: payment_message,
        payment_time,
        error_message
      } = order_info;

      console.log(`[DEBUG] Extracted values - Status: ${transactionStatus}, Payment Mode: ${payment_mode}, Gateway: ${gateway}`);

      // Add order_id to webhook log for easier tracking
      webhookLog.order_id = collect_id;

      // Verify that the order exists in our database
      const order = await Order.findById(collect_id);
      if (!order) {
        throw new Error(`Order with collect_id ${collect_id} not found`);
      }

      console.log(`[DEBUG] Found order: ${order._id}, current gateway: ${order.gateway_name}`);

      // Determine the correct gateway name with priority order
      let gatewayName = null;
      if (gateway && gateway.trim() !== '') {
        gatewayName = gateway.trim();
      } else if (payment_mode) {
        // Map payment modes to readable names
        const paymentModeMap = {
          'card': 'Card Payment',
          'upi': 'UPI',
          'netbanking': 'Net Banking',
          'wallet': 'Wallet'
        };
        gatewayName = paymentModeMap[payment_mode.toLowerCase()] || payment_mode.toUpperCase();
      }
      
      console.log(`[DEBUG] Determined gateway name: ${gatewayName}`);

      // Update or create order status
      const updateData = {
        collect_id,
        order_amount: order_amount || 0,
        transaction_amount: transaction_amount || order_amount || 0,
        payment_mode: payment_mode || null,
        payment_details: payment_details || null,
        bank_reference: bank_reference || null,
        payment_message: payment_message || null,
        status: transactionStatus || 'pending',
        error_message: error_message && error_message !== 'NA' ? error_message : null,
        payment_time: payment_time ? new Date(payment_time) : (transactionStatus === 'success' ? new Date() : null)
      };

      console.log(`[DEBUG] OrderStatus update data:`, JSON.stringify(updateData, null, 2));

      // Update the gateway_name in Order if we have a valid gateway name
      if (gatewayName) {
        console.log(`[DEBUG] Updating Order gateway_name from '${order.gateway_name}' to '${gatewayName}'`);
        await Order.findByIdAndUpdate(collect_id, { gateway_name: gatewayName });
      }

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

      console.log(`[INFO] Order status updated for collect_id: ${collect_id}`);
      console.log(`[DEBUG] Updated OrderStatus:`, JSON.stringify({
        collect_id: updatedOrderStatus.collect_id,
        status: updatedOrderStatus.status,
        payment_mode: updatedOrderStatus.payment_mode,
        payment_time: updatedOrderStatus.payment_time
      }, null, 2));

      // Verify the Order was also updated
      const updatedOrder = await Order.findById(collect_id);
      console.log(`[DEBUG] Updated Order gateway_name: ${updatedOrder.gateway_name}`);

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

// Development only: Simulate payment completion
const simulatePaymentCompletion = async (req, res) => {
  try {
    const { collect_id, status = 'success', payment_mode = 'card' } = req.body;

    if (!collect_id) {
      return res.status(400).json({
        message: 'collect_id is required'
      });
    }

    // Simulate webhook payload
    const simulatedWebhook = {
      status: 200,
      order_info: {
        order_id: collect_id,
        order_amount: 2000,
        transaction_amount: 2000,
        gateway: payment_mode === 'card' ? 'Card Payment' : 
                payment_mode === 'upi' ? 'PhonePe' :
                payment_mode === 'netbanking' ? 'Net Banking' :
                payment_mode === 'wallet' ? 'Digital Wallet' : 'PhonePe',
        bank_reference: `REF${Date.now()}`,
        status: status,
        payment_mode: payment_mode,
        payemnt_details: `${payment_mode} payment completed successfully`,
        Payment_message: status === 'success' ? 'Payment successful' : 'Payment failed',
        payment_time: new Date().toISOString(),
        error_message: status === 'failed' ? 'Test failure simulation' : 'NA'
      }
    };

    // Create fake request object
    const fakeReq = {
      body: simulatedWebhook
    };

    // Create fake response object
    const fakeRes = {
      status: (code) => ({
        json: (data) => {
          console.log(`[DEV] Simulated webhook response: ${code}`, data);
          return data;
        }
      })
    };

    // Call the webhook handler
    await handleWebhook(fakeReq, fakeRes);

    res.status(200).json({
      message: `Payment status simulated successfully`,
      collect_id,
      simulated_status: status,
      payment_mode
    });

  } catch (error) {
    console.error('[ERROR] Simulate payment completion error:', error);
    res.status(500).json({
      message: 'Error simulating payment completion'
    });
  }
};

module.exports = {
  handleWebhook,
  getWebhookLogs,
  simulatePaymentCompletion
};