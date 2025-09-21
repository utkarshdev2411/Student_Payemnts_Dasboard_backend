const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:5173', // Local development
    'http://localhost:3000', // Alternative local development
    'https://student-payemnts-dasboard-frontend.vercel.app' // Production frontend
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const authRoutes = require('./routes/auth');
const paymentRoutes = require('./routes/payments');
const transactionRoutes = require('./routes/transactions');
const webhookRoutes = require('./routes/webhook');

// Development routes (only in development mode)
let devRoutes;
if (process.env.NODE_ENV !== 'production') {
  devRoutes = require('./routes/dev');
}

// Route middleware
app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/webhook', webhookRoutes);

// Development routes (only in development mode)
if (process.env.NODE_ENV !== 'production' && devRoutes) {
  app.use('/api/dev', devRoutes);
  console.log('[INFO] Development routes enabled at /api/dev');
}

// Basic health check route
app.get('/', (req, res) => {
  res.json({ 
    message: 'School Payment API Server is running!',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Handle 404 routes - must be last middleware
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Start server
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`[INFO] Server is running on port ${PORT}`);
  console.log(`[INFO] Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`[INFO] Server URL: http://localhost:${PORT}`);
});

module.exports = app;