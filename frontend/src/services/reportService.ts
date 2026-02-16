import api from '../config/api';
import type { ApiResponse } from '../types/auth.types';

export interface OccupancyReport {
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  totalReservations: number;
  totalRoomNights: number;
  occupancyRate: number;
  period: {
    startDate: string;
    endDate: string;
    days: number;
  };
}

export interface RevenueReport {
  summary: {
    total: number;
    paid: number;
    pending: number;
  };
  byStatus: Array<{
    _id: string;
    total: number;
    count: number;
  }>;
  byPaymentMethod: Array<{
    _id: string;
    total: number;
    count: number;
  }>;
  overTime: Array<{
    _id: string;
    revenue: number;
    invoices: number;
  }>;
  period: {
    startDate: string;
    endDate: string;
  };
}

export interface BookingStats {
  byStatus: Array<{
    _id: string;
    count: number;
  }>;
  byRoomType: Array<{
    _id: string;
    count: number;
    revenue: number;
  }>;
  bySource: Array<{
    _id: string;
    count: number;
  }>;
  period: {
    startDate: string;
    endDate: string;
  };
}

export interface DashboardSummary {
  todayCheckIns: number;
  todayCheckOuts: number;
  occupancy: {
    occupied: number;
    total: number;
    available: number;
    rate: string;
  };
  pendingTasks: number;
  monthRevenue: number;
}

interface ReportFilters {
  startDate?: string;
  endDate?: string;
  groupBy?: 'day' | 'month' | 'year';
}

class ReportService {
  /**
   * Get occupancy report
   */
  async getOccupancyReport(filters?: ReportFilters): Promise<ApiResponse<OccupancyReport>> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await api.get<ApiResponse<OccupancyReport>>(`/reports/occupancy?${params.toString()}`);
    return response.data;
  }

  /**
   * Get revenue report
   */
  async getRevenueReport(filters?: ReportFilters): Promise<ApiResponse<RevenueReport>> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await api.get<ApiResponse<RevenueReport>>(`/reports/revenue?${params.toString()}`);
    return response.data;
  }

  /**
   * Get booking statistics
   */
  async getBookingStats(filters?: ReportFilters): Promise<ApiResponse<BookingStats>> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await api.get<ApiResponse<BookingStats>>(`/reports/bookings?${params.toString()}`);
    return response.data;
  }

  /**
   * Get dashboard summary
   */
  async getDashboardSummary(): Promise<ApiResponse<DashboardSummary>> {
    const response = await api.get<ApiResponse<DashboardSummary>>('/reports/dashboard');
    return response.data;
  }
}

export default new ReportService();