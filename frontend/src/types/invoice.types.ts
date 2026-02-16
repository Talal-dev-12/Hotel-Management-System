export interface Invoice {
  _id: string;
  invoiceNumber: string;
  reservationId: string | {
    _id: string;
    guestId: string;
    roomId: string;
  };
  guestId: string | {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  roomCharges: number;
  serviceCharges: ServiceCharge[];
  taxes: {
    gst: number;
    serviceTax: number;
    other: number;
  };
  discount: number;
  totalAmount: number;
  amountPaid: number;
  balanceAmount: number;
  paymentStatus: 'Unpaid' | 'Partially Paid' | 'Paid' | 'Refunded';
  paymentMethod?: 'Cash' | 'Card' | 'UPI' | 'Net Banking' | 'Cheque';
  paymentDate?: string;
  notes?: string;
  generatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceCharge {
  serviceName: string;
  amount: number;
  quantity: number;
}

export interface CreateInvoiceData {
  reservationId: string;
  serviceCharges?: ServiceCharge[];
  taxes?: {
    gst?: number;
    serviceTax?: number;
    other?: number;
  };
  discount?: number;
}

export interface UpdatePaymentData {
  amountPaid: number;
  paymentMethod: 'Cash' | 'Card' | 'UPI' | 'Net Banking' | 'Cheque';
}

export interface InvoiceFilters {
  paymentStatus?: string;
  guestId?: string;
  page?: number;
  limit?: number;
}