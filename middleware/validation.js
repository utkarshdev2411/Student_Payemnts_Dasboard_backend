const Joi = require('joi');

/**
 * Creates a validation middleware for Joi schemas
 * @param {Object} schema - Joi schema object
 * @param {string} property - Property to validate ('body', 'query', 'params')
 * @returns {Function} Express middleware function
 */
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const dataToValidate = req[property];
    
    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false, // Return all validation errors
      allowUnknown: true, // Allow unknown keys (useful for query params)
      stripUnknown: true // Remove unknown keys from the result
    });

    if (error) {
      const validationErrors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context.value
      }));

      console.log(`[WARN] Validation failed for ${req.method} ${req.path}:`, validationErrors);

      return res.status(400).json({
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    // Replace the original data with validated and sanitized data
    req[property] = value;
    next();
  };
};

/**
 * Validates request body using Joi schema
 * @param {Object} schema - Joi schema object
 * @returns {Function} Express middleware function
 */
const validateBody = (schema) => validate(schema, 'body');

/**
 * Validates query parameters using Joi schema
 * @param {Object} schema - Joi schema object
 * @returns {Function} Express middleware function
 */
const validateQuery = (schema) => validate(schema, 'query');

/**
 * Validates route parameters using Joi schema
 * @param {Object} schema - Joi schema object
 * @returns {Function} Express middleware function
 */
const validateParams = (schema) => validate(schema, 'params');

/**
 * Combines multiple validation middlewares
 * @param {Object} options - Object containing body, query, and/or params schemas
 * @returns {Array} Array of validation middleware functions
 */
const validateAll = (options = {}) => {
  const middlewares = [];
  
  if (options.body) {
    middlewares.push(validateBody(options.body));
  }
  
  if (options.query) {
    middlewares.push(validateQuery(options.query));
  }
  
  if (options.params) {
    middlewares.push(validateParams(options.params));
  }
  
  return middlewares;
};

/**
 * Higher-order function that creates a validation middleware for common patterns
 * @param {Object} schemas - Object containing validation schemas
 * @returns {Object} Object with predefined validation middleware functions
 */
const createValidators = (schemas) => {
  return {
    // Auth validators
    validateRegister: validateBody(schemas.registerSchema),
    validateLogin: validateBody(schemas.loginSchema),
    
    // Payment validators
    validateCreatePayment: validateBody(schemas.createPaymentSchema),
    
    // Transaction validators
    validateTransactionQuery: validateQuery(schemas.transactionQuerySchema),
    validateCollectId: validateParams(schemas.collectIdSchema),
    validateSchoolId: validateParams(schemas.schoolIdSchema),
    
    // Webhook validators
    validateWebhook: validateBody(schemas.webhookSchema),
    
    // Combined validators
    validateTransactionWithParams: validateAll({
      query: schemas.transactionQuerySchema,
      params: schemas.schoolIdSchema
    }),
    
    validateTransactionStatus: validateAll({
      params: schemas.collectIdSchema
    })
  };
};

module.exports = {
  validate,
  validateBody,
  validateQuery,
  validateParams,
  validateAll,
  createValidators
};