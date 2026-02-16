import api from '../config/api';
import type { Task, CreateTaskData, UpdateTaskStatusData, TaskFilters } from '../types/task.types';
import type { ApiResponse } from '../types/auth.types';

class TaskService {
  /**
   * Get all tasks
   */
  async getTasks(filters?: TaskFilters): Promise<ApiResponse<Task[]>> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await api.get<ApiResponse<Task[]>>(`/tasks?${params.toString()}`);
    return response.data;
  }

  /**
   * Get single task
   */
  async getTask(id: string): Promise<ApiResponse<Task>> {
    const response = await api.get<ApiResponse<Task>>(`/tasks/${id}`);
    return response.data;
  }

  /**
   * Create new task
   */
  async createTask(data: CreateTaskData): Promise<ApiResponse<Task>> {
    const response = await api.post<ApiResponse<Task>>('/tasks', data);
    return response.data;
  }

  /**
   * Update task
   */
  async updateTask(id: string, data: Partial<CreateTaskData>): Promise<ApiResponse<Task>> {
    const response = await api.put<ApiResponse<Task>>(`/tasks/${id}`, data);
    return response.data;
  }

  /**
   * Update task status
   */
  async updateTaskStatus(id: string, data: UpdateTaskStatusData): Promise<ApiResponse<Task>> {
    const response = await api.put<ApiResponse<Task>>(`/tasks/${id}/status`, data);
    return response.data;
  }

  /**
   * Get my tasks (for assigned staff)
   */
  async getMyTasks(status?: string): Promise<ApiResponse<Task[]>> {
    const params = status ? `?status=${status}` : '';
    const response = await api.get<ApiResponse<Task[]>>(`/tasks/my-tasks${params}`);
    return response.data;
  }

  /**
   * Delete task
   */
  async deleteTask(id: string): Promise<ApiResponse<{}>> {
    const response = await api.delete<ApiResponse<{}>>(`/tasks/${id}`);
    return response.data;
  }
}

export default new TaskService();