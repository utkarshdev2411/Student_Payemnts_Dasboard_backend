const express = require('express');
const router = express.Router();
const { Order, OrderStatus } = require('../models');

// Development only: Complete payment manually
router.post('/complete-payment/:collectId', async (req, res) => {
  try {
    const { collectId } = req.params;
    const { payment_mode = 'card', status = 'success' } = req.body;

    console.log(`[DEV] Manually completing payment: ${collectId}`);

    // Check if order exists
    const order = await Order.findById(collectId);
    if (!order) {
      return res.status(404).json({
        message: 'Order not found',
        collect_id: collectId
      });
    }

    // Update order status
    const updateData = {
      status: status,
      payment_time: new Date(),
      payment_mode: payment_mode,
      payment_details: `${payment_mode} payment completed manually`,
      payment_message: 'Payment completed successfully (manual)',
      bank_reference: `MAN${Date.now()}`,
      transaction_amount: order.order_amount || 2000
    };

    if (status === 'failed') {
      updateData.error_message = 'Manual test failure';
      updateData.payment_message = 'Payment failed (manual test)';
    }

    const updatedStatus = await OrderStatus.findOneAndUpdate(
      { collect_id: collectId },
      updateData,
      { new: true, upsert: true }
    );

    // Update gateway name based on payment method
    const gatewayName = payment_mode === 'card' ? 'Card Payment' :
                       payment_mode === 'upi' ? 'UPI' :
                       payment_mode === 'netbanking' ? 'Net Banking' :
                       payment_mode === 'wallet' ? 'Wallet' : 'PhonePe';

    await Order.findByIdAndUpdate(collectId, { gateway_name: gatewayName });

    console.log(`[DEV] Payment manually completed: ${collectId} - Status: ${status}`);

    res.status(200).json({
      message: `Payment ${status} completed manually`,
      collect_id: collectId,
      status: status,
      payment_mode: payment_mode,
      gateway_name: gatewayName,
      updated_data: updatedStatus
    });

  } catch (error) {
    console.error('[DEV ERROR] Manual payment completion error:', error);
    res.status(500).json({
      message: 'Error completing payment manually',
      error: error.message
    });
  }
});

// Development only: Get all pending payments
router.get('/pending-payments', async (req, res) => {
  try {
    const pendingOrders = await Order.aggregate([
      {
        $lookup: {
          from: 'orderstatuses',
          localField: '_id',
          foreignField: 'collect_id',
          as: 'status'
        }
      },
      {
        $match: {
          $or: [
            { 'status': { $size: 0 } }, // No status record
            { 'status.status': 'pending' } // Pending status
          ]
        }
      },
      {
        $project: {
          collect_id: '$_id',
          student_name: '$student_info.name',
          student_id: '$student_info.id',
          gateway_name: '$gateway_name',
          created_at: '$createdAt',
          status: { $ifNull: [{ $arrayElemAt: ['$status.status', 0] }, 'pending'] }
        }
      }
    ]);

    res.status(200).json({
      message: 'Pending payments retrieved',
      count: pendingOrders.length,
      data: pendingOrders
    });

  } catch (error) {
    console.error('[DEV ERROR] Get pending payments error:', error);
    res.status(500).json({
      message: 'Error retrieving pending payments',
      error: error.message
    });
  }
});

module.exports = router;