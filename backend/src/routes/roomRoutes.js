const express = require('express');
const router = express.Router();
const {
  getRooms,
  getAvailableRooms,
  getRoom,
  createRoom,
  updateRoom,
  updateRoomStatus,
  deleteRoom,
  getRoomStats,
} = require('../controllers/roomController');
const { protect, authorize, optionalAuth } = require('../middlewares/auth');

// Public routes
router.get('/', optionalAuth, getRooms);
router.get('/available', getAvailableRooms);
router.get('/:id', getRoom);

// Protected routes
router.use(protect);

// Admin and Manager only
router.post('/', authorize('Admin', 'Manager'), createRoom);
router.put('/:id', authorize('Admin', 'Manager'), updateRoom);
router.delete('/:id', authorize('Admin'), deleteRoom);
router.get('/stats/overview', authorize('Admin', 'Manager'), getRoomStats);

// Admin, Manager, Receptionist can update status
router.put('/:id/status', authorize('Admin', 'Manager', 'Receptionist'), updateRoomStatus);

module.exports = router;