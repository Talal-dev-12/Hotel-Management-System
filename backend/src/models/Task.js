const mongoose = require('mongoose');

/**
 * Task Schema
 * Manages housekeeping and maintenance tasks
 */
const taskSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: [true, 'Room ID is required'],
    },
    taskType: {
      type: String,
      enum: ['Cleaning', 'Maintenance', 'Inspection', 'Setup'],
      required: [true, 'Task type is required'],
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    description: {
      type: String,
      trim: true,
    },
    remarks: {
      type: String,
      trim: true,
    },
    scheduledDate: {
      type: Date,
    },
    completedDate: {
      type: Date,
    },
    estimatedDuration: {
      type: Number,
      comment: 'Duration in minutes',
    },
    actualDuration: {
      type: Number,
      comment: 'Duration in minutes',
    },
    images: [{
      type: String,
      comment: 'Before/After images',
    }],
  },
  {
    timestamps: true,
  }
);

// Auto-update room status based on task completion
taskSchema.post('save', async function (doc) {
  if (doc.status === 'Completed' && doc.taskType === 'Cleaning') {
    const Room = mongoose.model('Room');
    await Room.findByIdAndUpdate(doc.roomId, { status: 'Available' });
  }
});

// Index for faster queries
taskSchema.index({ assignedTo: 1, status: 1 });
taskSchema.index({ roomId: 1, status: 1 });
taskSchema.index({ taskType: 1, status: 1 });

module.exports = mongoose.model('Task', taskSchema);