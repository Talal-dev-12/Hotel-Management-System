import api from '../config/api';
import type { UserProfile, ApiResponse } from '../types/auth.types';

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: 'Admin' | 'Manager' | 'Receptionist' | 'Housekeeping' | 'Guest';
  phone?: string;
  address?: string;
}

export interface UserFilters {
  role?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

class UserService {
  /**
   * Get all users
   */
  async getUsers(filters?: UserFilters): Promise<ApiResponse<UserProfile[]>> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await api.get<ApiResponse<UserProfile[]>>(`/users?${params.toString()}`);
    return response.data;
  }

  /**
   * Get single user
   */
  async getUser(id: string): Promise<ApiResponse<UserProfile>> {
    const response = await api.get<ApiResponse<UserProfile>>(`/users/${id}`);
    return response.data;
  }

  /**
   * Create new user
   */
  async createUser(data: CreateUserData): Promise<ApiResponse<UserProfile>> {
    const response = await api.post<ApiResponse<UserProfile>>('/users', data);
    return response.data;
  }

  /**
   * Update user
   */
  async updateUser(id: string, data: Partial<CreateUserData>): Promise<ApiResponse<UserProfile>> {
    const response = await api.put<ApiResponse<UserProfile>>(`/users/${id}`, data);
    return response.data;
  }

  /**
   * Deactivate user
   */
  async deactivateUser(id: string): Promise<ApiResponse<UserProfile>> {
    const response = await api.put<ApiResponse<UserProfile>>(`/users/${id}/deactivate`);
    return response.data;
  }

  /**
   * Activate user
   */
  async activateUser(id: string): Promise<ApiResponse<UserProfile>> {
    const response = await api.put<ApiResponse<UserProfile>>(`/users/${id}/activate`);
    return response.data;
  }

  /**
   * Delete user
   */
  async deleteUser(id: string): Promise<ApiResponse<{}>> {
    const response = await api.delete<ApiResponse<{}>>(`/users/${id}`);
    return response.data;
  }
}

export default new UserService();