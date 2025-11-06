import api from './api';
import type { Job, JobFilters, PaginatedResponse, ApiResponse } from '@/types';

export const jobService = {
  /**
   * Get all jobs with filters
   */
  getJobs: async (filters?: JobFilters): Promise<PaginatedResponse<Job>> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    const response = await api.get(`/jobs?${params.toString()}`);
    return response.data;
  },

  /**
   * Get job by ID
   */
  getJobById: async (id: string): Promise<ApiResponse<{ job: Job }>> => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },

  /**
   * Create new job (employer only)
   */
  createJob: async (jobData: Partial<Job>): Promise<ApiResponse<{ job: Job }>> => {
    const response = await api.post('/jobs', jobData);
    return response.data;
  },

  /**
   * Update job (employer only)
   */
  updateJob: async (id: string, jobData: Partial<Job>): Promise<ApiResponse<void>> => {
    const response = await api.patch(`/jobs/${id}`, jobData);
    return response.data;
  },

  /**
   * Delete job (employer only)
   */
  deleteJob: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/jobs/${id}`);
    return response.data;
  },

  /**
   * Search jobs
   */
  searchJobs: async (query: string, filters?: JobFilters): Promise<PaginatedResponse<Job>> => {
    const params = new URLSearchParams({ q: query });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    const response = await api.get(`/search/jobs?${params.toString()}`);
    return response.data;
  },

  /**
   * Apply for a job
   */
  applyForJob: async (
    jobId: string,
    applicationData: {
      coverLetter: string;
      resume: string;
      portfolio?: string;
      expectedSalary?: number;
      availableFrom?: string;
      answers?: { question: string; answer: string }[];
    }
  ): Promise<ApiResponse<void>> => {
    const response = await api.post(`/jobs/${jobId}/apply`, applicationData);
    return response.data;
  },
};

