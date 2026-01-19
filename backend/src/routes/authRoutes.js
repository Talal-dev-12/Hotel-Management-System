const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  changePassword,
} = require('../controllers/authController');
const { protect } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
} = require('../validations/authValidation');

// Public routes
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

// Protected routes
router.use(protect);

router.post('/logout', logout);
router.get('/profile', getProfile);
router.put('/profile', validate(updateProfileSchema), updateProfile);
router.put('/change-password', validate(changePasswordSchema), changePassword);

module.exports = router;