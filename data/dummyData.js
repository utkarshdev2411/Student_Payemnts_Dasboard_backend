const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Generate dummy user data with hashed passwords
const users = [
  {
    username: 'admin',
    password: bcrypt.hashSync('password123', 10)
  },
  {
    username: 'school_admin',
    password: bcrypt.hashSync('school123', 10)
  },
  {
    username: 'test_user',
    password: bcrypt.hashSync('test123', 10)
  }
];

// Generate dummy order data
const orders = [
  {
    _id: new mongoose.Types.ObjectId(),
    school_id: '65b0e6293e9f76a9694d84b4',
    student_info: {
      name: 'Alice Johnson',
      id: 'STU101',
      email: 'alice.j@example.com'
    },
    gateway_name: 'PhonePe',
    createdAt: new Date('2024-09-15T10:30:00.000Z'),
    updatedAt: new Date('2024-09-15T10:30:00.000Z')
  },
  {
    _id: new mongoose.Types.ObjectId(),
    school_id: '65b0e6293e9f76a9694d84b4',
    student_info: {
      name: 'Bob Smith',
      id: 'STU102',
      email: 'bob.smith@example.com'
    },
    gateway_name: 'Razorpay',
    createdAt: new Date('2024-09-16T14:15:00.000Z'),
    updatedAt: new Date('2024-09-16T14:15:00.000Z')
  },
  {
    _id: new mongoose.Types.ObjectId(),
    school_id: 'SCHOOL_B_ID',
    student_info: {
      name: 'Charlie Brown',
      id: 'STU103',
      email: 'charlie.b@example.com'
    },
    gateway_name: 'Razorpay',
    createdAt: new Date('2024-09-17T09:00:00.000Z'),
    updatedAt: new Date('2024-09-17T09:00:00.000Z')
  },
  {
    _id: new mongoose.Types.ObjectId(),
    school_id: '65b0e6293e9f76a9694d84b4',
    student_info: {
      name: 'Diana Prince',
      id: 'STU104',
      email: 'diana.prince@example.com'
    },
    gateway_name: 'PhonePe',
    createdAt: new Date('2024-09-17T11:20:00.000Z'),
    updatedAt: new Date('2024-09-17T11:20:00.000Z')
  },
  {
    _id: new mongoose.Types.ObjectId(),
    school_id: 'SCHOOL_C_ID',
    student_info: {
      name: 'Eva Green',
      id: 'STU105',
      email: 'eva.green@example.com'
    },
    gateway_name: 'PayU',
    createdAt: new Date('2024-09-17T16:45:00.000Z'),
    updatedAt: new Date('2024-09-17T16:45:00.000Z')
  }
];

// Generate corresponding order status data
const orderStatuses = [
  {
    collect_id: orders[0]._id,
    order_amount: 1500,
    transaction_amount: 1500,
    payment_mode: 'upi',
    payment_details: 'UPI ID: alice@okaxis, Bank: Axis Bank',
    bank_reference: 'AXI123456789',
    payment_message: 'Payment successful',
    status: 'success',
    payment_time: new Date('2024-09-15T10:35:00.000Z'),
    createdAt: new Date('2024-09-15T10:30:00.000Z'),
    updatedAt: new Date('2024-09-15T10:35:00.000Z')
  },
  {
    collect_id: orders[1]._id,
    order_amount: 2000,
    transaction_amount: null,
    payment_mode: null,
    status: 'pending',
    payment_time: null,
    createdAt: new Date('2024-09-16T14:15:00.000Z'),
    updatedAt: new Date('2024-09-16T14:15:00.000Z')
  },
  {
    collect_id: orders[2]._id,
    order_amount: 500,
    transaction_amount: null,
    payment_mode: 'card',
    payment_details: 'Card Type: Credit, Last Four: 4567',
    status: 'failed',
    error_message: 'Insufficient funds',
    payment_time: null,
    createdAt: new Date('2024-09-17T09:00:00.000Z'),
    updatedAt: new Date('2024-09-17T09:05:00.000Z')
  },
  {
    collect_id: orders[3]._id,
    order_amount: 3000,
    transaction_amount: 3000,
    payment_mode: 'upi',
    payment_details: 'UPI ID: diana@paytm, Bank: HDFC Bank',
    bank_reference: 'HDFC987654321',
    payment_message: 'Payment completed',
    status: 'success',
    payment_time: new Date('2024-09-17T11:25:00.000Z'),
    createdAt: new Date('2024-09-17T11:20:00.000Z'),
    updatedAt: new Date('2024-09-17T11:25:00.000Z')
  },
  {
    collect_id: orders[4]._id,
    order_amount: 1200,
    transaction_amount: null,
    payment_mode: null,
    status: 'pending',
    payment_time: null,
    createdAt: new Date('2024-09-17T16:45:00.000Z'),
    updatedAt: new Date('2024-09-17T16:45:00.000Z')
  }
];

module.exports = {
  users,
  orders,
  orderStatuses
};