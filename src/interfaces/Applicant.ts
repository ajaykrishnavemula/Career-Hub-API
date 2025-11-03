import { Document, Types } from 'mongoose';

// Education interface
export interface IEducation {
  institution: string;
  degree: string;
  field: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  description?: string;
}

// Work experience interface
export interface IWorkExperience {
  company: string;
  position: string;
  location?: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  description?: string;
}

// Skill interface
export interface ISkill {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience?: number;
}

// Project interface
export interface IProject {
  title: string;
  description: string;
  startDate?: Date;
  endDate?: Date;
  url?: string;
  technologies?: string[];
}

// Certificate interface
export interface ICertificate {
  name: string;
  issuer: string;
  issueDate: Date;
  expiryDate?: Date;
  credentialId?: string;
  url?: string;
}

// Language interface
export interface ILanguage {
  name: string;
  proficiency: 'basic' | 'conversational' | 'fluent' | 'native';
}

// Social profile interface
export interface ISocialProfile {
  platform: 'linkedin' | 'github' | 'twitter' | 'portfolio' | 'other';
  url: string;
}

// Applicant profile interface
export interface IApplicantProfile extends Document {
  userId: Types.ObjectId;
  headline?: string;
  summary?: string;
  location?: {
    city: string;
    state?: string;
    country: string;
  };
  phone?: string;
  education: IEducation[];
  workExperience: IWorkExperience[];
  skills: ISkill[];
  projects?: IProject[];
  certificates?: ICertificate[];
  languages?: ILanguage[];
  socialProfiles?: ISocialProfile[];
  resume?: {
    url: string;
    filename: string;
    uploadDate: Date;
  };
  preferredJobTypes?: ('full-time' | 'part-time' | 'contract' | 'internship' | 'temporary')[];
  preferredLocations?: string[];
  preferredIndustries?: string[];
  isRemoteOnly?: boolean;
  salaryExpectation?: {
    min?: number;
    max?: number;
    currency: string;
    period: 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  };
  availability?: {
    immediate: boolean;
    availableFrom?: Date;
    noticePeriod?: number; // in days
  };
  createdAt: Date;
  updatedAt: Date;
}

// Job application interface
export interface IJobApplication extends Document {
  jobId: Types.ObjectId;
  applicantId: Types.ObjectId;
  resumeUrl?: string;
  coverLetter?: string;
  answers?: {
    questionId: string;
    question: string;
    answer: string;
  }[];
  status: 'applied' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected' | 'withdrawn';
  notes?: {
    content: string;
    createdBy: Types.ObjectId;
    createdAt: Date;
  }[];
  interviews?: {
    scheduledFor: Date;
    duration: number; // in minutes
    type: 'phone' | 'video' | 'in-person';
    location?: string;
    interviewers?: Types.ObjectId[];
    feedback?: {
      rating: number;
      strengths?: string[];
      weaknesses?: string[];
      notes?: string;
      recommendation: 'strong_yes' | 'yes' | 'maybe' | 'no' | 'strong_no';
      createdBy: Types.ObjectId;
      createdAt: Date;
    }[];
  }[];
  appliedAt: Date;
  updatedAt: Date;
}

// Made with Bob
