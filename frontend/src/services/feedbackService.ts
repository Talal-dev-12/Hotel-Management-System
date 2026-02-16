import api from '../config/api';
import type { Feedback, CreateFeedbackData, RespondToFeedbackData, FeedbackFilters } from '../types/feedback.types';
import type { ApiResponse } from '../types/auth.types';

class FeedbackService {
  /**
   * Submit feedback
   */
  async submitFeedback(data: CreateFeedbackData): Promise<ApiResponse<Feedback>> {
    const response = await api.post<ApiResponse<Feedback>>('/feedback', data);
    return response.data;
  }

  /**
   * Get all feedback
   */
  async getAllFeedback(filters?: FeedbackFilters): Promise<ApiResponse<Feedback[]>> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await api.get<ApiResponse<Feedback[]>>(`/feedback?${params.toString()}`);
    return response.data;
  }

  /**
   * Get single feedback
   */
  async getFeedback(id: string): Promise<ApiResponse<Feedback>> {
    const response = await api.get<ApiResponse<Feedback>>(`/feedback/${id}`);
    return response.data;
  }

  /**
   * Respond to feedback
   */
  async respondToFeedback(id: string, data: RespondToFeedbackData): Promise<ApiResponse<Feedback>> {
    const response = await api.put<ApiResponse<Feedback>>(`/feedback/${id}/respond`, data);
    return response.data;
  }

  /**
   * Update feedback status
   */
  async updateFeedbackStatus(id: string, status: string): Promise<ApiResponse<Feedback>> {
    const response = await api.put<ApiResponse<Feedback>>(`/feedback/${id}/status`, { status });
    return response.data;
  }

  /**
   * Get my feedback (for guests)
   */
  async getMyFeedback(): Promise<ApiResponse<Feedback[]>> {
    const response = await api.get<ApiResponse<Feedback[]>>('/feedback/my-feedback');
    return response.data;
  }

  /**
   * Get feedback statistics
   */
  async getFeedbackStats(): Promise<ApiResponse<any>> {
    const response = await api.get<ApiResponse<any>>('/feedback/stats');
    return response.data;
  }
}

export default new FeedbackService();