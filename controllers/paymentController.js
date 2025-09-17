const jwt = require('jsonwebtoken');
const axios = require('axios');
const { Order, OrderStatus } = require('../models');

// Create payment
const createPayment = async (req, res) => {
  try {
    const { order_amount, callback_url, student_info } = req.body;
    const school_id = process.env.SCHOOL_ID;

    // Create order in database
    const order = new Order({
      school_id,
      student_info,
      gateway_name: 'PhonePe'
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
    const gatewayPayload = {
      school_id,
      amount: order_amount,
      callback_url,
      sign,
      collect_request_id: collect_id.toString()
    };

    console.log(`[INFO] Calling payment gateway for order: ${collect_id}`);

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

      // Extract payment URL from gateway response
      const paymentUrl = gatewayResponse.data.Collect_request_url || gatewayResponse.data.payment_url;

      if (!paymentUrl) {
        throw new Error('Payment URL not received from gateway');
      }

      res.status(200).json({
        payment_url: paymentUrl,
        collect_id: collect_id,
        order_amount: order_amount
      });

    } catch (gatewayError) {
      console.error('[ERROR] Payment gateway error:', gatewayError.message);
      
      // Update order status to failed
      await OrderStatus.findOneAndUpdate(
        { collect_id },
        { 
          status: 'failed',
          error_message: `Gateway error: ${gatewayError.message}`
        }
      );

      return res.status(502).json({
        message: 'Payment gateway temporarily unavailable',
        collect_id: collect_id
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