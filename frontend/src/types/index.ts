// User Types
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'employer' | 'admin';
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Job Types
export interface Job {
  _id: string;
  title: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  company: Company;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  experience: 'entry' | 'mid' | 'senior';
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  benefits: string[];
  remote: boolean;
  skills: string[];
  applicants: number;
  views: number;
  status: 'active' | 'closed' | 'draft';
  postedDate: string;
  deadline: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobFilters {
  page?: number;
  limit?: number;
  type?: string;
  location?: string;
  experience?: string;
  salary?: string;
  remote?: boolean;
  sort?: string;
  search?: string;
}

// Company Types
export interface Company {
  _id: string;
  name: string;
  logo?: string;
  description?: string;
  industry?: string;
  size?: string;
  founded?: number;
  location?: string;
  website?: string;
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
  };
  culture?: string;
  benefits?: string[];
  activeJobs?: number;
  followers?: number;
  rating?: number;
  reviews?: number;
  createdAt: string;
  updatedAt: string;
}

// Application Types
export interface Application {
  _id: string;
  job: Job | string;
  applicant: Applicant | string;
  status: 'pending' | 'reviewing' | 'shortlisted' | 'rejected' | 'accepted';
  coverLetter: string;
  resume: string;
  portfolio?: string;
  expectedSalary?: number;
  availableFrom?: string;
  answers?: {
    question: string;
    answer: string;
  }[];
  notes?: string;
  interviewDate?: string;
  appliedDate: string;
  lastUpdated: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationFilters {
  status?: string;
  page?: number;
  limit?: number;
}

// Applicant Types
export interface Applicant {
  _id: string;
  user: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  title?: string;
  bio?: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  resume?: string;
  portfolio?: string;
  socialMedia?: {
    linkedin?: string;
    github?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Experience {
  company: string;
  title: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description: string;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  graduationYear: number;
  description?: string;
}

// Message Types
export interface Message {
  _id: string;
  sender: User;
  recipient: User;
  content: string;
  read: boolean;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  _id: string;
  participant: {
    _id: string;
    name: string;
    avatar?: string;
  };
  lastMessage: {
    content: string;
    timestamp: string;
  };
  unreadCount: number;
}

// Analytics Types
export interface JobAnalytics {
  summary: {
    totalJobs: number;
    activeJobs: number;
    totalApplications: number;
    averageApplicationsPerJob: number;
  };
  topJobs: {
    _id: string;
    title: string;
    applications: number;
    views: number;
  }[];
  applicationTrends: {
    date: string;
    applications: number;
  }[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    items: T[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'employer';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

