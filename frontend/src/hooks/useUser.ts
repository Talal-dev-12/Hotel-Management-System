import { useState, useCallback } from 'react';
import userService from '../services/userService';
import type { UserProfile } from '../types/auth.types';
import type { CreateUserData, UserFilters } from '../services/userService';

export const useUser = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async (filters?: UserFilters) => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.getUsers(filters);
      if (response.data) {
        setUsers(response.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUser = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.getUser(id);
      if (response.data) {
        setCurrentUser(response.data);
        return response.data;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch user');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = useCallback(async (data: CreateUserData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.createUser(data);
      if (response.data) {
        setUsers(prev => [...prev, response.data]);
        return response.data;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create user');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (id: string, data: Partial<CreateUserData>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.updateUser(id, data);
      if (response.data) {
        setUsers(prev => prev.map(user => user._id === id ? response.data : user));
        if (currentUser?._id === id) {
          setCurrentUser(response.data);
        }
        return response.data;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update user');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  const deactivateUser = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.deactivateUser(id);
      if (response.data) {
        setUsers(prev => prev.map(user => user._id === id ? response.data : user));
        if (currentUser?._id === id) {
          setCurrentUser(response.data);
        }
        return response.data;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to deactivate user');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  const activateUser = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.activateUser(id);
      if (response.data) {
        setUsers(prev => prev.map(user => user._id === id ? response.data : user));
        if (currentUser?._id === id) {
          setCurrentUser(response.data);
        }
        return response.data;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to activate user');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  const deleteUser = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await userService.deleteUser(id);
      setUsers(prev => prev.filter(user => user._id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete user');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    users,
    currentUser,
    loading,
    error,
    fetchUsers,
    fetchUser,
    createUser,
    updateUser,
    deactivateUser,
    activateUser,
    deleteUser,
  };
};
