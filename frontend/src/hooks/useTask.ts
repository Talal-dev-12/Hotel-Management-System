import { useState, useCallback } from 'react';
import taskService from '../services/taskService';
import type { Task, CreateTaskData, UpdateTaskStatusData, TaskFilters } from '../types/task.types';

export const useTask = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async (filters?: TaskFilters) => {
    try {
      setLoading(true);
      setError(null);
      const response = await taskService.getTasks(filters);
      if (response.data) {
        setTasks(response.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTask = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await taskService.getTask(id);
      if (response.data) {
        setCurrentTask(response.data);
        return response.data;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch task');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (data: CreateTaskData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await taskService.createTask(data);
      if (response.data) {
        setTasks(prev => [...prev, response.data]);
        return response.data;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create task');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTask = useCallback(async (id: string, data: Partial<CreateTaskData>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await taskService.updateTask(id, data);
      if (response.data) {
        setTasks(prev => prev.map(task => task._id === id ? response.data : task));
        if (currentTask?._id === id) {
          setCurrentTask(response.data);
        }
        return response.data;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update task');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentTask]);

  const updateTaskStatus = useCallback(async (id: string, data: UpdateTaskStatusData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await taskService.updateTaskStatus(id, data);
      if (response.data) {
        setTasks(prev => prev.map(task => task._id === id ? response.data : task));
        if (currentTask?._id === id) {
          setCurrentTask(response.data);
        }
        return response.data;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update task status');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentTask]);

  const fetchMyTasks = useCallback(async (status?: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await taskService.getMyTasks(status);
      if (response.data) {
        setTasks(response.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch your tasks');
      console.error('Error fetching my tasks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await taskService.deleteTask(id);
      setTasks(prev => prev.filter(task => task._id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete task');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    tasks,
    currentTask,
    loading,
    error,
    fetchTasks,
    fetchTask,
    createTask,
    updateTask,
    updateTaskStatus,
    fetchMyTasks,
    deleteTask,
  };
};