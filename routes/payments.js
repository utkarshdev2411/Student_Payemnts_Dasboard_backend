const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// Import controllers
const { createPayment } = require('../controllers/paymentController');

// Import validation schemas and middleware
const schemas = require('../config/validationSchemas');
const { createValidators } = require('../middleware/validation');

// Create validators
const validators = createValidators(schemas);

// Route definitions with Joi validation
router.post('/create-payment', authenticateToken, validators.validateCreatePayment, createPayment);

module.exports = router;