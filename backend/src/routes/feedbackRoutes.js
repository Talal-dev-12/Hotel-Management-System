const express = require('express');
const router = express.Router();
const {
  submitFeedback,
  getAllFeedback,
  getFeedback,
  respondToFeedback,
  updateFeedbackStatus,
  getMyFeedback,
  getFeedbackStats,
} = require('../controllers/feedbackController');
const { protect, authorize } = require('../middlewares/auth');

// All routes are protected
router.use(protect);

router.get('/my-feedback', getMyFeedback);
router.get('/stats', authorize('Admin', 'Manager'), getFeedbackStats);

router.route('/')
  .get(authorize('Admin', 'Manager'), getAllFeedback)
  .post(submitFeedback);

router.route('/:id')
  .get(getFeedback);

router.put('/:id/respond', authorize('Admin', 'Manager'), respondToFeedback);
router.put('/:id/status', authorize('Admin', 'Manager'), updateFeedbackStatus);

module.exports = router;