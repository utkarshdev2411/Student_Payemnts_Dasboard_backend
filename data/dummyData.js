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

// Helper function to generate random data
const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];
const getRandomAmount = (min = 500, max = 5000) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

// Sample data arrays
const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan', 'Shaurya', 'Atharv', 'Advik', 'Pranav', 'Ananya', 'Fatima', 'Ira', 'Prisha', 'Anvi', 'Riya', 'Navya', 'Diya', 'Pihu', 'Anushka', 'Kavya', 'Anika', 'Myra', 'Sara', 'Aditi', 'Kiara'];
const lastNames = ['Sharma', 'Verma', 'Gupta', 'Kumar', 'Singh', 'Agarwal', 'Patel', 'Jain', 'Bansal', 'Agrawal', 'Goyal', 'Jindal', 'Arora', 'Malhotra', 'Chopra', 'Kapoor', 'Mehta', 'Khanna', 'Sinha', 'Joshi', 'Saxena', 'Mittal', 'Garg', 'Bhatia', 'Tandon', 'Sethi', 'Bhardwaj', 'Tiwari', 'Pandey', 'Mishra'];
const gateways = ['PhonePe', 'Razorpay', 'PayU', 'Paytm', 'CCAvenue', 'Cashfree'];
const schoolIds = ['65b0e6293e9f76a9694d84b4', '65b0e6293e9f76a9694d84b5', '65b0e6293e9f76a9694d84b6', '65b0e6293e9f76a9694d84b7', '65b0e6293e9f76a9694d84b8'];
const paymentModes = ['upi', 'card', 'netbanking', 'wallet'];
const statuses = ['success', 'pending', 'failed', 'cancelled'];
const banks = ['HDFC Bank', 'ICICI Bank', 'Axis Bank', 'SBI', 'Kotak Bank', 'Yes Bank', 'IndusInd Bank', 'BOB', 'Canara Bank', 'PNB'];
const upiProviders = ['paytm', 'phonepe', 'gpay', 'amazonpay', 'mobikwik', 'freecharge'];

// Generate 100 orders
const orders = [];
const orderStatuses = [];

for (let i = 1; i <= 100; i++) {
  const orderId = new mongoose.Types.ObjectId();
  const firstName = getRandomElement(firstNames);
  const lastName = getRandomElement(lastNames);
  const studentName = `${firstName} ${lastName}`;
  const studentId = `STU${String(i).padStart(4, '0')}`;
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`;
  const gateway = getRandomElement(gateways);
  const schoolId = getRandomElement(schoolIds);
  
  // Generate random dates in the last 30 days
  const now = new Date('2024-09-21');
  const startDate = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000)); // 30 days ago
  const createdAt = getRandomDate(startDate, now);
  const updatedAt = new Date(createdAt.getTime() + Math.random() * (2 * 60 * 60 * 1000)); // Up to 2 hours later

  const order = {
    _id: orderId,
    school_id: schoolId,
    student_info: {
      name: studentName,
      id: studentId,
      email: email
    },
    gateway_name: gateway,
    createdAt: createdAt,
    updatedAt: updatedAt
  };

  orders.push(order);

  // Generate order status for each order
  const orderAmount = getRandomAmount(500, 5000);
  const status = getRandomElement(statuses);
  const paymentMode = status === 'pending' ? null : getRandomElement(paymentModes);
  
  let transactionAmount = null;
  let paymentDetails = null;
  let bankReference = null;
  let paymentMessage = null;
  let errorMessage = null;
  let paymentTime = null;

  if (status === 'success') {
    transactionAmount = orderAmount;
    paymentTime = new Date(updatedAt.getTime() + Math.random() * (30 * 60 * 1000)); // Within 30 minutes
    
    if (paymentMode === 'upi') {
      const upiProvider = getRandomElement(upiProviders);
      const bank = getRandomElement(banks);
      paymentDetails = `UPI ID: ${firstName.toLowerCase()}@${upiProvider}, Bank: ${bank}`;
      bankReference = `${bank.substring(0, 3).toUpperCase()}${Math.floor(Math.random() * 1000000000)}`;
      paymentMessage = 'Payment successful';
    } else if (paymentMode === 'card') {
      const cardType = Math.random() > 0.5 ? 'Credit' : 'Debit';
      const lastFour = Math.floor(Math.random() * 9000) + 1000;
      paymentDetails = `Card Type: ${cardType}, Last Four: ${lastFour}`;
      bankReference = `CARD${Math.floor(Math.random() * 1000000000)}`;
      paymentMessage = 'Payment completed successfully';
    } else if (paymentMode === 'netbanking') {
      const bank = getRandomElement(banks);
      paymentDetails = `Bank: ${bank}`;
      bankReference = `NB${Math.floor(Math.random() * 1000000000)}`;
      paymentMessage = 'Net banking payment successful';
    } else if (paymentMode === 'wallet') {
      const walletProvider = getRandomElement(['Paytm', 'PhonePe', 'Amazon Pay', 'MobiKwik']);
      paymentDetails = `Wallet: ${walletProvider}`;
      bankReference = `WALLET${Math.floor(Math.random() * 1000000000)}`;
      paymentMessage = 'Wallet payment successful';
    }
  } else if (status === 'failed') {
    const errorMessages = [
      'Insufficient funds',
      'Transaction declined by bank',
      'Card expired',
      'Invalid PIN',
      'Payment gateway timeout',
      'Technical error occurred'
    ];
    errorMessage = getRandomElement(errorMessages);
    
    if (paymentMode === 'card') {
      const cardType = Math.random() > 0.5 ? 'Credit' : 'Debit';
      const lastFour = Math.floor(Math.random() * 9000) + 1000;
      paymentDetails = `Card Type: ${cardType}, Last Four: ${lastFour}`;
    } else if (paymentMode === 'upi') {
      const upiProvider = getRandomElement(upiProviders);
      paymentDetails = `UPI ID: ${firstName.toLowerCase()}@${upiProvider}`;
    }
  } else if (status === 'cancelled') {
    errorMessage = 'Payment cancelled by user';
  }

  const orderStatus = {
    collect_id: orderId,
    order_amount: orderAmount,
    transaction_amount: transactionAmount,
    payment_mode: paymentMode,
    payment_details: paymentDetails,
    bank_reference: bankReference,
    payment_message: paymentMessage,
    status: status,
    error_message: errorMessage,
    payment_time: paymentTime,
    createdAt: createdAt,
    updatedAt: updatedAt
  };

  orderStatuses.push(orderStatus);
}

module.exports = {
  users,
  orders,
  orderStatuses
};