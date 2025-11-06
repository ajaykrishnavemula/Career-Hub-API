import { create } from 'zustand';
import { jobService } from '@/services/job.service';
import type { Job, JobFilters } from '@/types';

interface JobState {
  jobs: Job[];
  currentJob: Job | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  } | null;
  
  // Actions
  fetchJobs: (filters?: JobFilters) => Promise<void>;
  fetchJobById: (id: string) => Promise<void>;
  searchJobs: (query: string, filters?: JobFilters) => Promise<void>;
  clearCurrentJob: () => void;
  clearError: () => void;
}

export const useJobStore = create<JobState>((set) => ({
  jobs: [],
  currentJob: null,
  isLoading: false,
  error: null,
  pagination: null,

  fetchJobs: async (filters?: JobFilters) => {
    try {
      set({ isLoading: true, error: null });
      const response = await jobService.getJobs(filters);
      
      if (response.success && response.data) {
        set({
          jobs: response.data.items,
          pagination: response.data.pagination,
          isLoading: false,
        });
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch jobs',
        isLoading: false,
      });
    }
  },

  fetchJobById: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await jobService.getJobById(id);
      
      if (response.success && response.data) {
        set({
          currentJob: response.data.job,
          isLoading: false,
        });
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch job',
        isLoading: false,
      });
    }
  },

  searchJobs: async (query: string, filters?: JobFilters) => {
    try {
      set({ isLoading: true, error: null });
      const response = await jobService.searchJobs(query, filters);
      
      if (response.success && response.data) {
        set({
          jobs: response.data.items,
          pagination: response.data.pagination,
          isLoading: false,
        });
      }
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to search jobs',
        isLoading: false,
      });
    }
  },

  clearCurrentJob: () => {
    set({ currentJob: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));


