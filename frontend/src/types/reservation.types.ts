export interface Reservation {
  _id: string;
  guestId: string | {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  roomId: string | {
    _id: string;
    roomNumber: string;
    roomType: string;
    price: number;
  };
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: {
    adults: number;
    children: number;
  };
  bookingStatus: 'Pending' | 'Confirmed' | 'CheckedIn' | 'CheckedOut' | 'Cancelled';
  totalAmount: number;
  advancePayment: number;
  specialRequests?: string;
  bookingSource: 'Website' | 'Phone' | 'Walk-in' | 'Travel Agency' | 'OTA';
  confirmedBy?: string;
  cancelledBy?: string;
  cancellationReason?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReservationData {
  guestId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: {
    adults: number;
    children: number;
  };
  totalAmount: number;
  advancePayment?: number;
  specialRequests?: string;
  bookingSource?: 'Website' | 'Phone' | 'Walk-in' | 'Travel Agency' | 'OTA';
}

export interface CheckAvailabilityData {
  checkInDate: string;
  checkOutDate: string;
  roomType?: string;
}

export interface ReservationFilters {
  status?: string;
  checkInDate?: string;
  checkOutDate?: string;
  guestId?: string;
  page?: number;
  limit?: number;
}