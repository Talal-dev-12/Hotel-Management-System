const express = require('express');
const router = express.Router();
const {
  checkAvailability,
  createReservation,
  getReservations,
  getReservation,
  updateReservation,
  checkIn,
  checkOut,
  cancelReservation,
  getMyReservations,
} = require('../controllers/reservationController');
const { protect, authorize } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');
const {
  createReservationSchema,
  updateReservationSchema,
  checkAvailabilitySchema,
} = require('../validations/reservationValidation');

// Public route
router.post('/check-availability', validate(checkAvailabilitySchema), checkAvailability);

// Protected routes
router.use(protect);

router.get('/my-bookings', getMyReservations);

router.route('/')
  .get(authorize('Admin', 'Manager', 'Receptionist'), getReservations)
  .post(validate(createReservationSchema), createReservation);

router.route('/:id')
  .get(getReservation)
  .put(authorize('Admin', 'Manager', 'Receptionist'), validate(updateReservationSchema), updateReservation);

router.put('/:id/check-in', authorize('Admin', 'Manager', 'Receptionist'), checkIn);
router.put('/:id/check-out', authorize('Admin', 'Manager', 'Receptionist'), checkOut);
router.put('/:id/cancel', cancelReservation);

module.exports = router;