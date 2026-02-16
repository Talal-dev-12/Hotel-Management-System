export interface Room {
  _id: string;
  roomNumber: string;
  roomType: 'Single' | 'Double' | 'Suite' | 'Deluxe' | 'Presidential';
  price: number;
  status: 'Available' | 'Occupied' | 'Cleaning' | 'Maintenance';
  description?: string;
  amenities?: string[];
  capacity: {
    adults: number;
    children: number;
  };
  floor: number;
  images?: string[];
  bedType?: 'Single' | 'Double' | 'Queen' | 'King';
  size?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoomData {
  roomNumber: string;
  roomType: 'Single' | 'Double' | 'Suite' | 'Deluxe' | 'Presidential';
  price: number;
  floor: number;
  capacity: {
    adults: number;
    children: number;
  };
  description?: string;
  amenities?: string[];
  bedType?: 'Single' | 'Double' | 'Queen' | 'King';
  size?: number;
}

export interface RoomFilters {
  roomType?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

export interface RoomStats {
  total: number;
  byStatus: Array<{
    _id: string;
    count: number;
  }>;
}