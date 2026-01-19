const express = require('express');
const router = express.Router();
const {
  generateInvoice,
  getInvoices,
  getInvoice,
  getInvoiceByReservation,
  updatePayment,
  getMyInvoices,
} = require('../controllers/invoiceController');
const { protect, authorize } = require('../middlewares/auth');

// All routes are protected
router.use(protect);

router.get('/my-invoices', getMyInvoices);

router.route('/')
  .get(authorize('Admin', 'Manager', 'Receptionist'), getInvoices)
  .post(authorize('Admin', 'Manager', 'Receptionist'), generateInvoice);

router.get('/reservation/:reservationId', getInvoiceByReservation);

router.route('/:id')
  .get(getInvoice);

router.put('/:id/payment', authorize('Admin', 'Manager', 'Receptionist'), updatePayment);

module.exports = router;