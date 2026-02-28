import { useState, useCallback } from 'react';
import reservationService from '../services/reservationService';
import type { Reservation, CreateReservationData, CheckAvailabilityData, ReservationFilters } from '../types/reservation.types';
import type { Room } from '../types/room.types';

export const useReservation = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [currentReservation, setCurrentReservation] = useState<Reservation | null>(null);
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkAvailability = useCallback(async (data: CheckAvailabilityData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await reservationService.checkAvailability(data);
      if (response.data) {
        setAvailableRooms(response.data);
        return response.data;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to check availability');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createReservation = useCallback(async (data: CreateReservationData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await reservationService.createReservation(data);
      if (response.data) {
        console.log('Created reservation:', response.data);
        setReservations(prev => [...prev, response.data]);
        setCurrentReservation(response.data);
        return response.data;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create reservation');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchReservations = useCallback(async (filters?: ReservationFilters) => {
    try {
      setLoading(true);
      setError(null);
      const response = await reservationService.getReservations(filters);
      if (response.data) {
        setReservations(response.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch reservations');
      console.error('Error fetching reservations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchReservation = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await reservationService.getReservation(id);
      if (response.data) {
        setCurrentReservation(response.data);
        return response.data;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch reservation');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateReservation = useCallback(async (id: string, data: Partial<CreateReservationData>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await reservationService.updateReservation(id, data);
      if (response.data) {
        setReservations(prev => prev.map(res => res._id === id ? response.data : res));
        if (currentReservation?._id === id) {
          setCurrentReservation(response.data);
        }
        return response.data;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update reservation');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentReservation]);

  const checkIn = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await reservationService.checkIn(id);
      if (response.data) {
        setReservations(prev => prev.map(res => res._id === id ? response.data : res));
        if (currentReservation?._id === id) {
          setCurrentReservation(response.data);
        }
        return response.data;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to check in');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentReservation]);

  const checkOut = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await reservationService.checkOut(id);
      if (response.data) {
        setReservations(prev => prev.map(res => res._id === id ? response.data : res));
        if (currentReservation?._id === id) {
          setCurrentReservation(response.data);
        }
        return response.data;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to check out');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentReservation]);

  const cancelReservation = useCallback(async (id: string, reason?: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await reservationService.cancelReservation(id, reason);
      if (response.data) {
        setReservations(prev => prev.map(res => res._id === id ? response.data : res));
        if (currentReservation?._id === id) {
          setCurrentReservation(response.data);
        }
        return response.data;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to cancel reservation');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentReservation]);

  const fetchMyReservations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await reservationService.getMyReservations();
      if (response.data) {
        setReservations(response.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch your reservations');
      console.error('Error fetching my reservations:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    reservations,
    currentReservation,
    availableRooms,
    loading,
    error,
    checkAvailability,
    createReservation,
    fetchReservations,
    fetchReservation,
    updateReservation,
    checkIn,
    checkOut,
    cancelReservation,
    fetchMyReservations,
  };
};
