const express = require('express');
const router = express.Router();

// Import controllers
const { register, login } = require('../controllers/authController');

// Import validation schemas and middleware
const schemas = require('../config/validationSchemas');
const { createValidators } = require('../middleware/validation');

// Create validators
const validators = createValidators(schemas);

// Route definitions with Joi validation
router.post('/register', validators.validateRegister, register);
router.post('/login', validators.validateLogin, login);

module.exports = router;