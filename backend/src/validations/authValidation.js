const Joi = require('joi');

/**
 * Validation schemas for authentication
 */

// Register validation
exports.registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    'string.empty': 'Name is required',
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name cannot exceed 50 characters',
  }),
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Please provide a valid email',
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters',
  }),
  role: Joi.string().valid('Admin', 'Manager', 'Receptionist', 'Housekeeping', 'Guest'),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/),
  address: Joi.string(),
});

// Login validation
exports.loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Please provide a valid email',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required',
  }),
});

// Update profile validation
exports.updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/),
  address: Joi.string(),
});

// Change password validation
exports.changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
});