const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  updateTaskStatus,
  getMyTasks,
  deleteTask,
} = require('../controllers/taskController');
const { protect, authorize } = require('../middlewares/auth');

// All routes are protected
router.use(protect);

router.get('/my-tasks', getMyTasks);

router.route('/')
  .get(getTasks)
  .post(authorize('Admin', 'Manager', 'Receptionist'), createTask);

router.route('/:id')
  .get(getTask)
  .put(updateTask)
  .delete(authorize('Admin', 'Manager'), deleteTask);

router.put('/:id/status', updateTaskStatus);

module.exports = router;