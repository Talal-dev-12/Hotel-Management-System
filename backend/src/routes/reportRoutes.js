const express = require('express');
const router = express.Router();
const {
  getOccupancyReport,
  getRevenueReport,
  getBookingStats,
  getDashboardSummary,
} = require('../controllers/reportController');
const { protect, authorize } = require('../middlewares/auth');

// All routes are protected and require Admin or Manager role
router.use(protect);
router.use(authorize('Admin', 'Manager'));

router.get('/occupancy', getOccupancyReport);
router.get('/revenue', getRevenueReport);
router.get('/bookings', getBookingStats);
router.get('/dashboard', getDashboardSummary);

module.exports = router;