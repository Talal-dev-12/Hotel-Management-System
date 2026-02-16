// User Profile from API
export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Receptionist' | 'Housekeeping' | 'Guest';
  phone?: string;
  address?: string;
  status: 'active' | 'inactive';
  profileImage?: string;
  createdAt: string;
  updatedAt?: string;
}

// Login credentials
export interface LoginCredentials {
  email: string;
  password: string;
}

// Registration data
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: string;
  phone?: string;
  address?: string;
}

// Auth response from login/register
export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  refreshToken: string;
  data: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  count?: number;
  total?: number;
  totalPages?: number;
  currentPage?: number;
}

// Error response
export interface ApiError {
  status: number;
  message: string;
  data?: any;
}