const jwt = require('jsonwebtoken');
const axios = require('axios');
const { Order, OrderStatus } = require('../models');
const mongoose = require('mongoose');

// Get all transactions with pagination, filtering, and sorting
const getAllTransactions = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'payment_time',
      order = 'desc',
      status,
      schoolId,
      startDate,
      endDate
    } = req.query;

    // Build aggregation pipeline
    const pipeline = [];

    // Match stage for filtering
    const matchFilter = {};
    
    if (status) {
      matchFilter['orderStatus.status'] = status;
    }
    
    if (schoolId) {
      matchFilter['order.school_id'] = schoolId;
    }
    
    if (startDate || endDate) {
      matchFilter['orderStatus.payment_time'] = {};
      if (startDate) matchFilter['orderStatus.payment_time'].$gte = new Date(startDate);
      if (endDate) matchFilter['orderStatus.payment_time'].$lte = new Date(endDate);
    }

    // Aggregation pipeline
    pipeline.push(
      // Lookup to join Order and OrderStatus
      {
        $lookup: {
          from: 'orderstatuses',
          localField: '_id',
          foreignField: 'collect_id',
          as: 'orderStatus'
        }
      },
      // Unwind the orderStatus array
      {
        $unwind: {
          path: '$orderStatus',
          preserveNullAndEmptyArrays: true
        }
      },
      // Add computed fields for easier access
      {
        $addFields: {
          collect_id: '$_id',
          order: '$$ROOT'
        }
      }
    );

    // Add match filter if any
    if (Object.keys(matchFilter).length > 0) {
      pipeline.push({ $match: matchFilter });
    }

    // Sort stage
    const sortField = sortBy === 'payment_time' ? 'orderStatus.payment_time' :
                     sortBy === 'order_amount' ? 'orderStatus.order_amount' :
                     sortBy === 'transaction_amount' ? 'orderStatus.transaction_amount' :
                     sortBy === 'status' ? 'orderStatus.status' :
                     'order.createdAt';
    
    const sortDirection = order === 'asc' ? 1 : -1;
    pipeline.push({ $sort: { [sortField]: sortDirection, '_id': -1 } });

    // Get total count for pagination
    const countPipeline = [...pipeline, { $count: 'total' }];
    const countResult = await Order.aggregate(countPipeline);
    const total = countResult.length > 0 ? countResult[0].total : 0;

    // Add pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    pipeline.push(
      { $skip: skip },
      { $limit: parseInt(limit) }
    );

    // Project final response format
    pipeline.push({
      $project: {
        _id: 0, // Exclude the default _id
        collect_id: '$_id',
        custom_order_id: '$_id', // Add this field for frontend requirement
        school_id: '$school_id',
        student_name: '$student_info.name',
        student_id: '$student_info.id',
        student_email: '$student_info.email',
        gateway_name: '$gateway_name',
        order_amount: '$orderStatus.order_amount',
        transaction_amount: '$orderStatus.transaction_amount',
        payment_mode: '$orderStatus.payment_mode',
        payment_details: '$orderStatus.payment_details',
        bank_reference: '$orderStatus.bank_reference',
        payment_message: '$orderStatus.payment_message',
        status: '$orderStatus.status',
        error_message: '$orderStatus.error_message',
        payment_time: '$orderStatus.payment_time',
        order_created_at: '$createdAt',
        status_updated_at: '$orderStatus.updatedAt'
      }
    });

    const transactions = await Order.aggregate(pipeline);

    res.status(200).json({
      data: transactions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        limit: parseInt(limit)
      },
      filters: {
        status,
        schoolId,
        startDate,
        endDate,
        sortBy,
        order
      }
    });

  } catch (error) {
    console.error('[ERROR] Get all transactions error:', error);
    res.status(500).json({
      message: 'Internal server error retrieving transactions'
    });
  }
};

// Get transactions by school ID
const getTransactionsBySchool = async (req, res) => {
  try {
    const { schoolId } = req.params;
    
    // Add schoolId to query and call getAllTransactions
    req.query.schoolId = schoolId;
    
    // Reuse the getAllTransactions logic
    await getAllTransactions(req, res);

  } catch (error) {
    console.error('[ERROR] Get transactions by school error:', error);
    res.status(500).json({
      message: 'Internal server error retrieving school transactions'
    });
  }
};

// Get transaction status by collect ID
const getTransactionStatus = async (req, res) => {
  try {
    const { collectId } = req.params;

    // First, check if order exists
    const order = await Order.findById(collectId);
    if (!order) {
      return res.status(404).json({
        message: 'Transaction not found'
      });
    }

    // Try to get latest status from payment gateway first
    const school_id = process.env.SCHOOL_ID;
    
    try {
      // Generate JWT sign for status check
      const signPayload = {
        school_id,
        collect_request_id: collectId
      };

      const sign = jwt.sign(signPayload, process.env.PG_KEY, { expiresIn: '1h' });

      // Call payment gateway for latest status
      const gatewayResponse = await axios.get(
        `https://dev-vanilla.edviron.com/erp/collect-request/${collectId}`,
        {
          params: {
            school_id,
            sign
          },
          headers: {
            'Authorization': `Bearer ${process.env.PG_API_KEY}`
          },
          timeout: 10000 // 10 second timeout
        }
      );

      console.log(`[INFO] Status check from gateway for collect_id: ${collectId}`);

      // Update local status if gateway returned data
      if (gatewayResponse.data && gatewayResponse.data.status) {
        const gatewayData = gatewayResponse.data;
        
        await OrderStatus.findOneAndUpdate(
          { collect_id: collectId },
          {
            status: gatewayData.status,
            payment_time: gatewayData.payment_time ? new Date(gatewayData.payment_time) : null,
            transaction_amount: gatewayData.transaction_amount || gatewayData.amount,
            payment_mode: gatewayData.payment_mode,
            payment_details: gatewayData.payment_details,
            bank_reference: gatewayData.bank_reference,
            payment_message: gatewayData.payment_message,
            error_message: gatewayData.error_message && gatewayData.error_message !== 'NA' ? gatewayData.error_message : null
          },
          { upsert: true, new: true }
        );
      }

    } catch (gatewayError) {
      console.warn(`[WARN] Gateway status check failed for ${collectId}:`, gatewayError.message);
      // Continue with local data if gateway fails
    }

    // Get current status from database
    const orderStatus = await OrderStatus.findOne({ collect_id: collectId });

    if (!orderStatus) {
      return res.status(200).json({
        collect_id: collectId,
        status: 'pending',
        message: 'Transaction status not yet available'
      });
    }

    res.status(200).json({
      collect_id: collectId,
      status: orderStatus.status,
      order_amount: orderStatus.order_amount,
      transaction_amount: orderStatus.transaction_amount,
      payment_mode: orderStatus.payment_mode,
      payment_details: orderStatus.payment_details,
      bank_reference: orderStatus.bank_reference,
      payment_message: orderStatus.payment_message,
      error_message: orderStatus.error_message,
      payment_time: orderStatus.payment_time,
      last_updated: orderStatus.updatedAt
    });

  } catch (error) {
    console.error('[ERROR] Get transaction status error:', error);
    res.status(500).json({
      message: 'Internal server error retrieving transaction status'
    });
  }
};

// Get transaction statistics (bonus endpoint)
const getTransactionStats = async (req, res) => {
  try {
    const { schoolId, startDate, endDate } = req.query;

    const matchFilter = {};
    if (schoolId) matchFilter.school_id = schoolId;
    if (startDate || endDate) {
      matchFilter.createdAt = {};
      if (startDate) matchFilter.createdAt.$gte = new Date(startDate);
      if (endDate) matchFilter.createdAt.$lte = new Date(endDate);
    }

    const pipeline = [
      { $match: matchFilter },
      {
        $lookup: {
          from: 'orderstatuses',
          localField: '_id',
          foreignField: 'collect_id',
          as: 'orderStatus'
        }
      },
      {
        $unwind: {
          path: '$orderStatus',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: null,
          totalTransactions: { $sum: 1 },
          successfulTransactions: {
            $sum: { $cond: [{ $eq: ['$orderStatus.status', 'success'] }, 1, 0] }
          },
          failedTransactions: {
            $sum: { $cond: [{ $eq: ['$orderStatus.status', 'failed'] }, 1, 0] }
          },
          pendingTransactions: {
            $sum: { $cond: [{ $eq: ['$orderStatus.status', 'pending'] }, 1, 0] }
          },
          totalAmount: { $sum: '$orderStatus.order_amount' },
          successfulAmount: {
            $sum: {
              $cond: [
                { $eq: ['$orderStatus.status', 'success'] },
                '$orderStatus.transaction_amount',
                0
              ]
            }
          }
        }
      }
    ];

    const stats = await Order.aggregate(pipeline);
    const result = stats.length > 0 ? stats[0] : {
      totalTransactions: 0,
      successfulTransactions: 0,
      failedTransactions: 0,
      pendingTransactions: 0,
      totalAmount: 0,
      successfulAmount: 0
    };

    // Calculate success rate
    result.successRate = result.totalTransactions > 0 
      ? ((result.successfulTransactions / result.totalTransactions) * 100).toFixed(2)
      : 0;

    res.status(200).json(result);

  } catch (error) {
    console.error('[ERROR] Get transaction stats error:', error);
    res.status(500).json({
      message: 'Internal server error retrieving transaction statistics'
    });
  }
};

module.exports = {
  getAllTransactions,
  getTransactionsBySchool,
  getTransactionStatus,
  getTransactionStats
};