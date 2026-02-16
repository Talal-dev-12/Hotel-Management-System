import api from '../config/api';
import type { Room, CreateRoomData, RoomFilters, RoomStats } from '../types/room.types';
import type { ApiResponse } from '../types/auth.types';

class RoomService {
  /**
   * Get all rooms
   */
  async getRooms(filters?: RoomFilters): Promise<ApiResponse<Room[]>> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await api.get<ApiResponse<Room[]>>(`/rooms?${params.toString()}`);
    return response.data;
  }

  /**
   * Get available rooms
   */
  async getAvailableRooms(roomType?: string): Promise<ApiResponse<Room[]>> {
    const params = roomType ? `?roomType=${roomType}` : '';
    const response = await api.get<ApiResponse<Room[]>>(`/rooms/available${params}`);
    return response.data;
  }

  /**
   * Get single room
   */
  async getRoom(id: string): Promise<ApiResponse<Room>> {
    const response = await api.get<ApiResponse<Room>>(`/rooms/${id}`);
    return response.data;
  }

  /**
   * Create new room
   */
  async createRoom(data: CreateRoomData): Promise<ApiResponse<Room>> {
    const response = await api.post<ApiResponse<Room>>('/rooms', data);
    return response.data;
  }

  /**
   * Update room
   */
  async updateRoom(id: string, data: Partial<CreateRoomData>): Promise<ApiResponse<Room>> {
    const response = await api.put<ApiResponse<Room>>(`/rooms/${id}`, data);
    return response.data;
  }

  /**
   * Update room status
   */
  async updateRoomStatus(id: string, status: string): Promise<ApiResponse<Room>> {
    const response = await api.put<ApiResponse<Room>>(`/rooms/${id}/status`, { status });
    return response.data;
  }

  /**
   * Delete room (soft delete)
   */
  async deleteRoom(id: string): Promise<ApiResponse<{}>> {
    const response = await api.delete<ApiResponse<{}>>(`/rooms/${id}`);
    return response.data;
  }

  /**
   * Get room statistics
   */
  async getRoomStats(): Promise<ApiResponse<RoomStats>> {
    const response = await api.get<ApiResponse<RoomStats>>('/rooms/stats/overview');
    return response.data;
  }
}

export default new RoomService();