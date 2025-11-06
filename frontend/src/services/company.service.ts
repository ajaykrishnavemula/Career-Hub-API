import api from './api';
import type { Company, PaginatedResponse, ApiResponse } from '@/types';

export const companyService = {
  /**
   * Get all companies
   */
  getCompanies: async (filters?: {
    page?: number;
    limit?: number;
    industry?: string;
    size?: string;
  }): Promise<PaginatedResponse<Company>> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    const response = await api.get(`/companies?${params.toString()}`);
    return response.data;
  },

  /**
   * Get company by ID
   */
  getCompanyById: async (id: string): Promise<ApiResponse<{ company: Company }>> => {
    const response = await api.get(`/companies/${id}`);
    return response.data;
  },

  /**
   * Follow company
   */
  followCompany: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.post(`/companies/${id}/follow`);
    return response.data;
  },

  /**
   * Unfollow company
   */
  unfollowCompany: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/companies/${id}/follow`);
    return response.data;
  },
};

