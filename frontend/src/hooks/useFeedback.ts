import { useState, useCallback } from 'react';
import feedbackService from '../services/feedbackService';
import type { Feedback, CreateFeedbackData, RespondToFeedbackData, FeedbackFilters } from '../types/feedback.types';

export const useFeedback = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [currentFeedback, setCurrentFeedback] = useState<Feedback | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitFeedback = useCallback(async (data: CreateFeedbackData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await feedbackService.submitFeedback(data);
      if (response.data) {
        setFeedbacks(prev => [...prev, response.data]);
        setCurrentFeedback(response.data);
        return response.data;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit feedback');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFeedbacks = useCallback(async (filters?: FeedbackFilters) => {
    try {
      setLoading(true);
      setError(null);
      const response = await feedbackService.getAllFeedback(filters);
      if (response.data) {
        setFeedbacks(response.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch feedbacks');
      console.error('Error fetching feedbacks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFeedback = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await feedbackService.getFeedback(id);
      if (response.data) {
        setCurrentFeedback(response.data);
        return response.data;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch feedback');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const respondToFeedback = useCallback(async (id: string, data: RespondToFeedbackData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await feedbackService.respondToFeedback(id, data);
      if (response.data) {
        setFeedbacks(prev => prev.map(fb => fb._id === id ? response.data : fb));
        if (currentFeedback?._id === id) {
          setCurrentFeedback(response.data);
        }
        return response.data;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to respond to feedback');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentFeedback]);

  const updateFeedbackStatus = useCallback(async (id: string, status: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await feedbackService.updateFeedbackStatus(id, status);
      if (response.data) {
        setFeedbacks(prev => prev.map(fb => fb._id === id ? response.data : fb));
        if (currentFeedback?._id === id) {
          setCurrentFeedback(response.data);
        }
        return response.data;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update feedback status');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentFeedback]);

  const fetchMyFeedback = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await feedbackService.getMyFeedback();
      if (response.data) {
        setFeedbacks(response.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch your feedback');
      console.error('Error fetching my feedback:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFeedbackStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await feedbackService.getFeedbackStats();
      if (response.data) {
        setStats(response.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch feedback stats');
      console.error('Error fetching feedback stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    feedbacks,
    currentFeedback,
    stats,
    loading,
    error,
    submitFeedback,
    fetchFeedbacks,
    fetchFeedback,
    respondToFeedback,
    updateFeedbackStatus,
    fetchMyFeedback,
    fetchFeedbackStats,
  };
};
