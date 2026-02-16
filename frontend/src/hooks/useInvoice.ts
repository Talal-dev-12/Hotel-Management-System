import { useState, useCallback } from 'react';
import invoiceService from '../services/invoiceService';
import type { Invoice, CreateInvoiceData, UpdatePaymentData, InvoiceFilters } from '../types/invoice.types';

export const useInvoice = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [currentInvoice, setCurrentInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateInvoice = useCallback(async (data: CreateInvoiceData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await invoiceService.generateInvoice(data);
      if (response.data) {
        setInvoices(prev => [...prev, response.data]);
        setCurrentInvoice(response.data);
        return response.data;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate invoice');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchInvoices = useCallback(async (filters?: InvoiceFilters) => {
    try {
      setLoading(true);
      setError(null);
      const response = await invoiceService.getInvoices(filters);
      if (response.data) {
        setInvoices(response.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch invoices');
      console.error('Error fetching invoices:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchInvoice = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await invoiceService.getInvoice(id);
      if (response.data) {
        setCurrentInvoice(response.data);
        return response.data;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch invoice');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchInvoiceByReservation = useCallback(async (reservationId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await invoiceService.getInvoiceByReservation(reservationId);
      if (response.data) {
        setCurrentInvoice(response.data);
        return response.data;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch invoice');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePayment = useCallback(async (id: string, data: UpdatePaymentData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await invoiceService.updatePayment(id, data);
      if (response.data) {
        setInvoices(prev => prev.map(inv => inv._id === id ? response.data : inv));
        if (currentInvoice?._id === id) {
          setCurrentInvoice(response.data);
        }
        return response.data;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update payment');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentInvoice]);

  const fetchMyInvoices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await invoiceService.getMyInvoices();
      if (response.data) {
        setInvoices(response.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch your invoices');
      console.error('Error fetching my invoices:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    invoices,
    currentInvoice,
    loading,
    error,
    generateInvoice,
    fetchInvoices,
    fetchInvoice,
    fetchInvoiceByReservation,
    updatePayment,
    fetchMyInvoices,
  };
};