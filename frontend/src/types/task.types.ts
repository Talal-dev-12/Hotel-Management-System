export interface Task {
  _id: string;
  roomId: string | {
    _id: string;
    roomNumber: string;
    roomType: string;
    floor: number;
  };
  taskType: 'Cleaning' | 'Maintenance' | 'Inspection' | 'Setup';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  assignedTo?: string | {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  assignedBy?: string | {
    _id: string;
    name: string;
  };
  description?: string;
  remarks?: string;
  scheduledDate?: string;
  completedDate?: string;
  estimatedDuration?: number;
  actualDuration?: number;
  images?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskData {
  roomId: string;
  taskType: 'Cleaning' | 'Maintenance' | 'Inspection' | 'Setup';
  priority?: 'Low' | 'Medium' | 'High' | 'Urgent';
  assignedTo?: string;
  description?: string;
  scheduledDate?: string;
  estimatedDuration?: number;
}

export interface UpdateTaskStatusData {
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  remarks?: string;
}

export interface TaskFilters {
  taskType?: string;
  status?: string;
  assignedTo?: string;
  priority?: string;
  page?: number;
  limit?: number;
}