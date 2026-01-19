const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deactivateUser,
  activateUser,
  deleteUser,
} = require('../controllers/userController');
const { protect, authorize } = require('../middlewares/auth');

// All routes are protected and require Admin or Manager role
router.use(protect);
router.use(authorize('Admin', 'Manager'));

router.route('/')
  .get(getUsers)
  .post(createUser);

router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(authorize('Admin'), deleteUser);

router.put('/:id/deactivate', authorize('Admin'), deactivateUser);
router.put('/:id/activate', authorize('Admin'), activateUser);

module.exports = router;