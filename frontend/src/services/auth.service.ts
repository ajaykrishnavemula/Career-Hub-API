import api from './api';
import type { User, LoginCredentials, RegisterData, ApiResponse } from '@/types';

export const authService = {
  /**
   * Register a new user
   */
  register: async (data: RegisterData): Promise<ApiResponse<{ user: User; token: string }>> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  /**
   * Login user
   */
  login: async (credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: string }>> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  /**
   * Get current user profile
   */
  getProfile: async (): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  /**
   * Verify email
   */
  verifyEmail: async (token: string): Promise<ApiResponse<void>> => {
    const response = await api.post('/auth/verify-email', { token });
    return response.data;
  },

  /**
   * Logout user
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

