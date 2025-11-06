import { Document, Types } from 'mongoose';

// Job location interface
export interface IJobLocation {
  city: string;
  state?: string;
  country: string;
  remote: boolean;
  type: 'onsite' | 'remote' | 'hybrid';
}

// Salary range interface
export interface ISalaryRange {
  min?: number;
  max?: number;
  currency: string;
  period: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  negotiable: boolean;
}

// Benefits interface
export interface IBenefits {
  healthInsurance?: boolean;
  paidTimeOff?: boolean;
  retirement?: boolean;
  flexibleHours?: boolean;
  remoteWork?: boolean;
  professionalDevelopment?: boolean;
  other?: string[];
}

// Application question interface
export interface IApplicationQuestion {
  question: string;
  required: boolean;
  type: 'text' | 'multiline' | 'select' | 'multiselect' | 'boolean';
  options?: string[];
}

// Job interface
export interface IJob extends Document {
  company: string;
  position: string;
  description: string;
  location: IJobLocation;
  salary?: ISalaryRange;
  benefits?: IBenefits;
  status: 'draft' | 'published' | 'archived' | 'closed';
  applicationStatus: 'open' | 'closed';
  jobType: 'full-time' | 'part-time' | 'contract' | 'internship' | 'temporary';
  experience: 'entry' | 'mid-level' | 'senior' | 'executive';
  requirements: string[];
  responsibilities: string[];
  applicationQuestions?: IApplicationQuestion[];
  applicationDeadline?: Date;
  categories: string[];
  tags: string[];
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

