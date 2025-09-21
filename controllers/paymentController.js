const jwt = require('jsonwebtoken');
const axios = require('axios');
const { Order, OrderStatus } = require('../models');

// Create payment
const createPayment = async (req, res) => {
  try {
    const { order_amount, callback_url, student_info } = req.body;
    const school_id = process.env.SCHOOL_ID;

    // Validate required fields
    if (!order_amount || !callback_url || !student_info) {
      return res.status(400).json({
        message: 'Missing required fields: order_amount, callback_url, or student_info'
      });
    }

    // Create order in database
    const order = new Order({
      school_id,
      student_info
      // gateway_name will be set by webhook or during payment processing
    });

    await order.save();
    const collect_id = order._id;

    console.log(`[INFO] Order created with ID: ${collect_id}`);

    // Create initial order status
    const orderStatus = new OrderStatus({
      collect_id,
      order_amount: parseFloat(order_amount),
      status: 'pending'
    });

    await orderStatus.save();

    // Generate JWT sign for payment gateway
    const signPayload = {
      school_id,
      amount: order_amount,
      callback_url,
      collect_request_id: collect_id.toString()
    };

    const sign = jwt.sign(signPayload, process.env.PG_KEY, { expiresIn: '1h' });

    // Prepare payment gateway request
    const webhookUrl = `${process.env.WEBHOOK_BASE_URL || 'http://localhost:8000'}/api/webhook`;
    const gatewayPayload = {
      school_id,
      amount: order_amount,
      callback_url,
      webhook_url: webhookUrl,
      sign,
      collect_request_id: collect_id.toString()
    };

    console.log(`[INFO] Calling payment gateway for order: ${collect_id}`);
    console.log(`[INFO] Webhook URL set to: ${webhookUrl}`);

    // Call external payment gateway
    try {
      const gatewayResponse = await axios.post(
        'https://dev-vanilla.edviron.com/erp/create-collect-request',
        gatewayPayload,
        {
          headers: {
            'Authorization': `Bearer ${process.env.PG_API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000 // 30 second timeout
        }
      );

      console.log(`[INFO] Payment gateway response received for order: ${collect_id}`);
      console.log(`[DEBUG] Gateway response status: ${gatewayResponse.status}`);
      console.log(`[DEBUG] Gateway response data:`, JSON.stringify(gatewayResponse.data, null, 2));

      // Extract payment URL from gateway response
      const paymentUrl = gatewayResponse.data.Collect_request_url || 
                        gatewayResponse.data.payment_url || 
                        gatewayResponse.data.collect_request_url ||
                        gatewayResponse.data.url;

      if (!paymentUrl) {
        console.error(`[ERROR] Payment URL not found in response. Available fields:`, Object.keys(gatewayResponse.data));
        
        // If gateway responds successfully but doesn't provide URL, 
        // create a mock payment URL for development
        const mockPaymentUrl = `https://dev-vanilla.edviron.com/payment?collect_id=${collect_id}&amount=${order_amount}`;
        console.log(`[WARNING] Using mock payment URL for development: ${mockPaymentUrl}`);
        
        // For development: Auto-complete payment after 10 seconds
        if (process.env.NODE_ENV !== 'production') {
          setTimeout(async () => {
            try {
              console.log(`[DEV] Auto-completing payment for development: ${collect_id}`);
              await OrderStatus.findOneAndUpdate(
                { collect_id },
                {
                  status: 'success',
                  payment_time: new Date(),
                  payment_mode: 'card',
                  payment_details: 'Development test payment',
                  payment_message: 'Payment completed successfully (development mode)',
                  bank_reference: `DEV${Date.now()}`
                }
              );
              
              // Update gateway name based on payment mode
              await Order.findByIdAndUpdate(collect_id, { 
                gateway_name: 'Development Gateway' 
              });
              
              console.log(`[DEV] Payment auto-completed: ${collect_id}`);
            } catch (devError) {
              console.error(`[DEV] Error auto-completing payment:`, devError);
            }
          }, 10000); // 10 seconds delay
        }
        
        return res.status(200).json({
          payment_url: mockPaymentUrl,
          collect_id: collect_id,
          order_amount: order_amount,
          mock_payment: true,
          message: 'Payment request created successfully (development mode)'
        });
      }

      res.status(200).json({
        payment_url: paymentUrl,
        collect_id: collect_id,
        order_amount: order_amount
      });

    } catch (gatewayError) {
      console.error('[ERROR] Payment gateway error:', gatewayError.message);
      console.error('[ERROR] Gateway error details:', {
        status: gatewayError.response?.status,
        statusText: gatewayError.response?.statusText,
        data: gatewayError.response?.data
      });
      
        // Update order status to failed
      await OrderStatus.findOneAndUpdate(
        { collect_id },
        { 
          status: 'failed',
          error_message: `Gateway error: ${gatewayError.message}`,
          payment_time: new Date()
        }
      );

      // Provide more specific error messages based on status code
      let errorMessage = 'Payment gateway temporarily unavailable';
      if (gatewayError.response?.status === 401) {
        errorMessage = 'Payment gateway authentication failed. Please contact support.';
        console.error('[ERROR] Authentication failed - check PG_API_KEY configuration');
      } else if (gatewayError.response?.status === 403) {
        errorMessage = 'Payment gateway access denied. Please contact support.';
      } else if (gatewayError.response?.status >= 500) {
        errorMessage = 'Payment gateway server error. Please try again later.';
      }

      return res.status(502).json({
        message: errorMessage,
        collect_id: collect_id,
        error_code: gatewayError.response?.status || 'GATEWAY_ERROR'
      });
    }

  } catch (error) {
    console.error('[ERROR] Create payment error:', error);
    res.status(500).json({
      message: 'Internal server error during payment creation'
    });
  }
};

module.exports = {
  createPayment
};