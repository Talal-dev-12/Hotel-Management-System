import api from '../config/api';
import type { Invoice, CreateInvoiceData, UpdatePaymentData, InvoiceFilters } from '../types/invoice.types';
import type { ApiResponse } from '../types/auth.types';

class InvoiceService {
  /**
   * Generate new invoice
   */
  async generateInvoice(data: CreateInvoiceData): Promise<ApiResponse<Invoice>> {
    const response = await api.post<ApiResponse<Invoice>>('/invoices', data);
    return response.data;
  }

  /**
   * Get all invoices
   */
  async getInvoices(filters?: InvoiceFilters): Promise<ApiResponse<Invoice[]>> {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await api.get<ApiResponse<Invoice[]>>(`/invoices?${params.toString()}`);
    return response.data;
  }

  /**
   * Get single invoice
   */
  async getInvoice(id: string): Promise<ApiResponse<Invoice>> {
    const response = await api.get<ApiResponse<Invoice>>(`/invoices/${id}`);
    return response.data;
  }

  /**
   * Get invoice by reservation
   */
  async getInvoiceByReservation(reservationId: string): Promise<ApiResponse<Invoice>> {
    const response = await api.get<ApiResponse<Invoice>>(`/invoices/reservation/${reservationId}`);
    return response.data;
  }

  /**
   * Update payment
   */
  async updatePayment(id: string, data: UpdatePaymentData): Promise<ApiResponse<Invoice>> {
    const response = await api.put<ApiResponse<Invoice>>(`/invoices/${id}/payment`, data);
    return response.data;
  }

  /**
   * Get my invoices (for guests)
   */
  async getMyInvoices(): Promise<ApiResponse<Invoice[]>> {
    const response = await api.get<ApiResponse<Invoice[]>>('/invoices/my-invoices');
    return response.data;
  }
}

export default new InvoiceService();