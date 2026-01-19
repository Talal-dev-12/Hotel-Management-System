const { ErrorResponse } = require('../utils/errorResponse');

/**
 * Validation Middleware
 * Validates request body against Joi schema
 */
exports.validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return next(new ErrorResponse(errorMessage, 400));
    }

    // Replace request body with validated value
    req.body = value;
    next();
  };
};