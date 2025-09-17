const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// Import controllers
const { 
  getAllTransactions, 
  getTransactionsBySchool, 
  getTransactionStatus,
  getTransactionStats
} = require('../controllers/transactionController');

// Import validation schemas and middleware
const schemas = require('../config/validationSchemas');
const { createValidators, validateAll } = require('../middleware/validation');

// Create validators
const validators = createValidators(schemas);

// Route definitions with Joi validation
router.get('/', authenticateToken, validators.validateTransactionQuery, getAllTransactions);
router.get('/stats', authenticateToken, validators.validateTransactionQuery, getTransactionStats);
router.get('/school/:schoolId', 
  authenticateToken, 
  validateAll({
    params: schemas.schoolIdSchema,
    query: schemas.transactionQuerySchema
  }),
  getTransactionsBySchool
);
router.get('/status/:collectId', 
  authenticateToken, 
  validators.validateCollectId, 
  getTransactionStatus
);

module.exports = router;