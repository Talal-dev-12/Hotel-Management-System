const Task = require('../models/Task');
const Room = require('../models/Room');
const asyncHandler = require('../middlewares/asyncHandler');
const { ErrorResponse } = require('../utils/errorResponse');

/**
 * @desc    Get all tasks
 * @route   GET /api/tasks
 * @access  Private
 */
exports.getTasks = asyncHandler(async (req, res, next) => {
  const { taskType, status, assignedTo, priority, page = 1, limit = 10 } = req.query;

  // Build query
  const query = {};
  
  if (taskType) query.taskType = taskType;
  if (status) query.status = status;
  if (assignedTo) query.assignedTo = assignedTo;
  if (priority) query.priority = priority;

  // Execute query with pagination
  const tasks = await Task.find(query)
    .populate('roomId', 'roomNumber roomType floor')
    .populate('assignedTo', 'name email role')
    .populate('assignedBy', 'name')
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort('-createdAt');

  const count = await Task.countDocuments(query);

  res.status(200).json({
    success: true,
    count: tasks.length,
    total: count,
    totalPages: Math.ceil(count / limit),
    currentPage: parseInt(page),
    data: tasks,
  });
});

/**
 * @desc    Get single task
 * @route   GET /api/tasks/:id
 * @access  Private
 */
exports.getTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id)
    .populate('roomId')
    .populate('assignedTo', 'name email role')
    .populate('assignedBy', 'name');

  if (!task) {
    return next(new ErrorResponse('Task not found', 404));
  }

  res.status(200).json({
    success: true,
    data: task,
  });
});

/**
 * @desc    Create new task
 * @route   POST /api/tasks
 * @access  Private (Admin, Manager, Receptionist)
 */
exports.createTask = asyncHandler(async (req, res, next) => {
  const { roomId } = req.body;

  // Verify room exists
  const room = await Room.findById(roomId);
  if (!room) {
    return next(new ErrorResponse('Room not found', 404));
  }

  // Create task
  const task = await Task.create({
    ...req.body,
    assignedBy: req.user.id,
  });

  await task.populate('roomId assignedTo assignedBy');

  res.status(201).json({
    success: true,
    message: 'Task created successfully',
    data: task,
  });
});

/**
 * @desc    Update task
 * @route   PUT /api/tasks/:id
 * @access  Private
 */
exports.updateTask = asyncHandler(async (req, res, next) => {
  let task = await Task.findById(req.params.id);

  if (!task) {
    return next(new ErrorResponse('Task not found', 404));
  }

  // If status is being changed to completed, set completedDate
  if (req.body.status === 'Completed' && task.status !== 'Completed') {
    req.body.completedDate = Date.now();
  }

  task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate('roomId assignedTo');

  res.status(200).json({
    success: true,
    message: 'Task updated successfully',
    data: task,
  });
});

/**
 * @desc    Update task status
 * @route   PUT /api/tasks/:id/status
 * @access  Private (Housekeeping, Admin, Manager)
 */
exports.updateTaskStatus = asyncHandler(async (req, res, next) => {
  const { status, remarks } = req.body;

  if (!status) {
    return next(new ErrorResponse('Please provide status', 400));
  }

  const updateData = { status };
  if (remarks) updateData.remarks = remarks;
  if (status === 'Completed') updateData.completedDate = Date.now();

  const task = await Task.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  ).populate('roomId');

  if (!task) {
    return next(new ErrorResponse('Task not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Task status updated successfully',
    data: task,
  });
});

/**
 * @desc    Get tasks assigned to me
 * @route   GET /api/tasks/my-tasks
 * @access  Private (Housekeeping)
 */
exports.getMyTasks = asyncHandler(async (req, res, next) => {
  const { status } = req.query;

  const query = { assignedTo: req.user.id };
  if (status) query.status = status;

  const tasks = await Task.find(query)
    .populate('roomId', 'roomNumber roomType floor')
    .sort('priority -createdAt');

  res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks,
  });
});

/**
 * @desc    Delete task
 * @route   DELETE /api/tasks/:id
 * @access  Private (Admin, Manager)
 */
exports.deleteTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findByIdAndDelete(req.params.id);

  if (!task) {
    return next(new ErrorResponse('Task not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Task deleted successfully',
    data: {},
  });
});