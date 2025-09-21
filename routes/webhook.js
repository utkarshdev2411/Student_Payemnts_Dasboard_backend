const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// Import controllers
const { handleWebhook, getWebhookLogs, simulatePaymentCompletion } = require('../controllers/webhookController');

// Import validation schemas and middleware
const schemas = require('../config/validationSchemas');
const { createValidators } = require('../middleware/validation');

// Create validators
const validators = createValidators(schemas);

// Route definitions with Joi validation
router.post('/', validators.validateWebhook, handleWebhook); // Public endpoint for payment gateway
router.get('/logs', authenticateToken, validators.validateTransactionQuery, getWebhookLogs); // Protected endpoint for viewing logs

// Development endpoint to simulate payment completion
if (process.env.NODE_ENV !== 'production') {
  router.post('/simulate', authenticateToken, simulatePaymentCompletion);
}

module.exports = router;