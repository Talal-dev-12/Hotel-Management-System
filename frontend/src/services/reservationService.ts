import api from '../config/api';
import type { Reservation, CreateReservationData, CheckAvailabilityData, ReservationFilters } from '../types/reservation.types';
import type { ApiResponse } from '../types/auth.types';
import type { Room } from '../types/room.types';

class ReservationService {
  /**
   * Check room availability
   */
  async checkAvailability(data: CheckAvailabilityData): Promise<ApiResponse<Room[]>> {
    const response = await api.post<ApiResponse<Room[]>>('/reservations/check-availability', data);
    return response.data;
  }

  /**
   * Create new reservation
   */
  async createReservation(data: CreateReservationData): Promise<ApiResponse<Reservation>> {
    const response = await api.post<ApiResponse<Reservation>>('/reservations', data);
    return response.data;
  }

  /**
   * Get all reservations
   */
  async getReservations(filters?: ReservationFilters): Promise<ApiResponse<Reservation[]>> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await api.get<ApiResponse<Reservation[]>>(`/reservations?${params.toString()}`);
    return response.data;
  }

  /**
   * Get single reservation
   */
  async getReservation(id: string): Promise<ApiResponse<Reservation>> {
    const response = await api.get<ApiResponse<Reservation>>(`/reservations/${id}`);
    return response.data;
  }

  /**
   * Update reservation
   */
  async updateReservation(id: string, data: Partial<CreateReservationData>): Promise<ApiResponse<Reservation>> {
    const response = await api.put<ApiResponse<Reservation>>(`/reservations/${id}`, data);
    return response.data;
  }

  /**
   * Check-in guest
   */
  async checkIn(id: string): Promise<ApiResponse<Reservation>> {
    const response = await api.put<ApiResponse<Reservation>>(`/reservations/${id}/check-in`);
    return response.data;
  }

  /**
   * Check-out guest
   */
  async checkOut(id: string): Promise<ApiResponse<Reservation>> {
    const response = await api.put<ApiResponse<Reservation>>(`/reservations/${id}/check-out`);
    return response.data;
  }

  /**
   * Cancel reservation
   */
  async cancelReservation(id: string, reason?: string): Promise<ApiResponse<Reservation>> {
    const response = await api.put<ApiResponse<Reservation>>(`/reservations/${id}/cancel`, { reason });
    return response.data;
  }

  /**
   * Get my reservations (for guests)
   */
  async getMyReservations(): Promise<ApiResponse<Reservation[]>> {
    const response = await api.get<ApiResponse<Reservation[]>>('/reservations/my-bookings');
    return response.data;
  }
}

export default new ReservationService();