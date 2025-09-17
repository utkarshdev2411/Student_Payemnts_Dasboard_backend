const Joi = require('joi');

// Authentication Schemas
const registerSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(50)
    .required()
    .messages({
      'string.alphanum': 'Username can only contain letters and numbers',
      'string.min': 'Username must be at least 3 characters long',
      'string.max': 'Username cannot exceed 50 characters',
      'any.required': 'Username is required'
    }),
  
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters long',
      'any.required': 'Password is required'
    })
});

const loginSchema = Joi.object({
  username: Joi.string()
    .required()
    .messages({
      'any.required': 'Username is required'
    }),
  
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password is required'
    })
});

// Payment Schemas
const createPaymentSchema = Joi.object({
  order_amount: Joi.number()
    .positive()
    .precision(2)
    .required()
    .messages({
      'number.positive': 'Order amount must be greater than 0',
      'any.required': 'Order amount is required'
    }),
  
  callback_url: Joi.string()
    .uri()
    .required()
    .messages({
      'string.uri': 'Callback URL must be a valid URL',
      'any.required': 'Callback URL is required'
    }),
  
  student_info: Joi.object({
    name: Joi.string()
      .trim()
      .min(1)
      .max(100)
      .required()
      .messages({
        'string.min': 'Student name cannot be empty',
        'string.max': 'Student name cannot exceed 100 characters',
        'any.required': 'Student name is required'
      }),
    
    id: Joi.string()
      .trim()
      .min(1)
      .max(50)
      .required()
      .messages({
        'string.min': 'Student ID cannot be empty',
        'string.max': 'Student ID cannot exceed 50 characters',
        'any.required': 'Student ID is required'
      }),
    
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Valid student email is required',
        'any.required': 'Student email is required'
      })
  }).required()
});

// Transaction Query Schemas
const transactionQuerySchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      'number.min': 'Page must be a positive integer'
    }),
  
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10)
    .messages({
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit cannot exceed 100'
    }),
  
  sortBy: Joi.string()
    .valid('payment_time', 'order_amount', 'transaction_amount', 'status', 'createdAt')
    .default('payment_time')
    .messages({
      'any.only': 'Invalid sort field'
    }),
  
  order: Joi.string()
    .valid('asc', 'desc')
    .default('desc')
    .messages({
      'any.only': 'Order must be asc or desc'
    }),
  
  status: Joi.string()
    .valid('pending', 'success', 'failed', 'cancelled', 'refunded')
    .messages({
      'any.only': 'Invalid status'
    }),
  
  schoolId: Joi.string()
    .max(100)
    .messages({
      'string.max': 'School ID too long'
    }),
  
  startDate: Joi.date()
    .iso()
    .messages({
      'date.format': 'Start date must be in ISO format'
    }),
  
  endDate: Joi.date()
    .iso()
    .min(Joi.ref('startDate'))
    .messages({
      'date.format': 'End date must be in ISO format',
      'date.min': 'End date must be after start date'
    })
});

// Parameter Schemas
const collectIdSchema = Joi.object({
  collectId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid collect ID format',
      'any.required': 'Collect ID is required'
    })
});

const schoolIdSchema = Joi.object({
  schoolId: Joi.string()
    .min(1)
    .max(100)
    .required()
    .messages({
      'string.min': 'School ID cannot be empty',
      'string.max': 'School ID too long',
      'any.required': 'School ID is required'
    })
});

// Webhook Schema (for validation if needed)
const webhookSchema = Joi.object({
  status: Joi.number().required(),
  order_info: Joi.object({
    order_id: Joi.string().required(),
    order_amount: Joi.number(),
    transaction_amount: Joi.number(),
    gateway: Joi.string(),
    bank_reference: Joi.string(),
    status: Joi.string().required(),
    payment_mode: Joi.string(),
    payemnt_details: Joi.string(), // Note: keeping original typo from spec
    Payment_message: Joi.string(),
    payment_time: Joi.date().iso(),
    error_message: Joi.string()
  }).required()
}).unknown(true); // Allow additional fields

module.exports = {
  // Auth schemas
  registerSchema,
  loginSchema,
  
  // Payment schemas
  createPaymentSchema,
  
  // Transaction schemas
  transactionQuerySchema,
  
  // Parameter schemas
  collectIdSchema,
  schoolIdSchema,
  
  // Webhook schema
  webhookSchema
};