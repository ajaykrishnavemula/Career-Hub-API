import api from './api';
import type { Application, ApplicationFilters, PaginatedResponse, ApiResponse } from '@/types';

export const applicationService = {
  /**
   * Create a new application
   */
  createApplication: async (data: {
    job: string;
    coverLetter?: string;
  }): Promise<ApiResponse<{ application: Application }>> => {
    const response = await api.post('/applications', data);
    return response.data;
  },

  /**
   * Get user's applications
   */
  getMyApplications: async (filters?: ApplicationFilters): Promise<PaginatedResponse<Application>> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    const response = await api.get(`/applications?${params.toString()}`);
    return response.data;
  },

  /**
   * Get application by ID
   */
  getApplicationById: async (id: string): Promise<ApiResponse<{ application: Application }>> => {
    const response = await api.get(`/applications/${id}`);
    return response.data;
  },

  /**
   * Withdraw application
   */
  withdrawApplication: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/applications/${id}`);
    return response.data;
  },

  /**
   * Get applications for a job (employer only)
   */
  getJobApplications: async (
    jobId: string,
    filters?: ApplicationFilters
  ): Promise<PaginatedResponse<Application>> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    const response = await api.get(`/jobs/${jobId}/applications?${params.toString()}`);
    return response.data;
  },

  /**
   * Update application status (employer only)
   */
  updateApplicationStatus: async (
    id: string,
    data: {
      status: string;
      notes?: string;
      interviewDate?: string;
    }
  ): Promise<ApiResponse<void>> => {
    const response = await api.patch(`/applications/${id}/status`, data);
    return response.data;
  },
};

