import { useState, useCallback, useEffect } from 'react';
import roomService from '../services/roomService';
import type { Room, RoomFilters, RoomStats } from '../types/room.types';
import type { ApiResponse } from '../types/auth.types';

export const useRoom = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<RoomStats | null>(null);

  const fetchRooms = useCallback(async (filters?: RoomFilters) => {
    try {
      setLoading(true);
      setError(null);
      const response = await roomService.getRooms(filters);
      if (response.data) {
        setRooms(response.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch rooms');
      console.error('Error fetching rooms:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAvailableRooms = useCallback(async (roomType?: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await roomService.getAvailableRooms(roomType);
      if (response.data) {
        setAvailableRooms(response.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch available rooms');
      console.error('Error fetching available rooms:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createRoom = useCallback(async (data: any) => {
    try {
      setLoading(true);
      setError(null);
      const response = await roomService.createRoom(data);
      if (response.data) {
        setRooms(prev => [...prev, response.data]);
        return response.data;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create room');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateRoom = useCallback(async (id: string, data: any) => {
    try {
      setLoading(true);
      setError(null);
      const response = await roomService.updateRoom(id, data);
      if (response.data) {
        setRooms(prev => prev.map(room => room._id === id ? response.data : room));
        return response.data;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update room');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateRoomStatus = useCallback(async (id: string, status: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await roomService.updateRoomStatus(id, status);
      if (response.data) {
        setRooms(prev => prev.map(room => room._id === id ? response.data : room));
        return response.data;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update room status');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteRoom = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await roomService.deleteRoom(id);
      setRooms(prev => prev.filter(room => room._id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete room');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRoomStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await roomService.getRoomStats();
      if (response.data) {
        setStats(response.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch room stats');
      console.error('Error fetching room stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    rooms,
    availableRooms,
    stats,
    loading,
    error,
    fetchRooms,
    fetchAvailableRooms,
    createRoom,
    updateRoom,
    updateRoomStatus,
    deleteRoom,
    fetchRoomStats,
  };
};