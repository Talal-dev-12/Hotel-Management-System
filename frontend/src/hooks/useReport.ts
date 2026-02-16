import { useState, useCallback } from 'react';
import reportService from '../services/reportService';
import type { OccupancyReport, RevenueReport, BookingStats, DashboardSummary } from '../services/reportService';

interface ReportFilters {
  startDate?: string;
  endDate?: string;
  groupBy?: 'day' | 'month' | 'year';
}

export const useReport = () => {
  const [occupancyReport, setOccupancyReport] = useState<OccupancyReport | null>(null);
  const [revenueReport, setRevenueReport] = useState<RevenueReport | null>(null);
  const [bookingStats, setBookingStats] = useState<BookingStats | null>(null);
  const [dashboardSummary, setDashboardSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOccupancyReport = useCallback(async (filters?: ReportFilters) => {
    try {
      setLoading(true);
      setError(null);
      const response = await reportService.getOccupancyReport(filters);
      if (response.data) {
        setOccupancyReport(response.data);
        return response.data;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch occupancy report');
      console.error('Error fetching occupancy report:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRevenueReport = useCallback(async (filters?: ReportFilters) => {
    try {
      setLoading(true);
      setError(null);
      const response = await reportService.getRevenueReport(filters);
      if (response.data) {
        setRevenueReport(response.data);
        return response.data;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch revenue report');
      console.error('Error fetching revenue report:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBookingStats = useCallback(async (filters?: ReportFilters) => {
    try {
      setLoading(true);
      setError(null);
      const response = await reportService.getBookingStats(filters);
      if (response.data) {
        setBookingStats(response.data);
        return response.data;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch booking stats');
      console.error('Error fetching booking stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDashboardSummary = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await reportService.getDashboardSummary();
      if (response.data) {
        setDashboardSummary(response.data);
        return response.data;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch dashboard summary');
      console.error('Error fetching dashboard summary:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    occupancyReport,
    revenueReport,
    bookingStats,
    dashboardSummary,
    loading,
    error,
    fetchOccupancyReport,
    fetchRevenueReport,
    fetchBookingStats,
    fetchDashboardSummary,
  };
};
