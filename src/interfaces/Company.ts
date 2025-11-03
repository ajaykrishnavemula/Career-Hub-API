import { Document, Types } from 'mongoose';

// Company location interface
export interface ICompanyLocation {
  address?: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
}

// Company social media interface
export interface ICompanySocialMedia {
  website?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  github?: string;
}

// Company team member interface
export interface ICompanyTeamMember {
  userId: Types.ObjectId;
  role: 'owner' | 'admin' | 'recruiter' | 'viewer';
  addedAt: Date;
}

// Company review interface
export interface ICompanyReview {
  userId: Types.ObjectId;
  rating: number; // 1-5
  title: string;
  review: string;
  pros?: string;
  cons?: string;
  isAnonymous: boolean;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

// Company interface
export interface ICompany extends Document {
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  logo?: string;
  coverImage?: string;
  industry: string[];
  companySize: 'solo' | '2-10' | '11-50' | '51-200' | '201-500' | '501-1000' | '1000+';
  founded?: Date;
  locations: ICompanyLocation[];
  headquarters?: ICompanyLocation;
  socialMedia?: ICompanySocialMedia;
  website?: string;
  isVerified: boolean;
  verificationDate?: Date;
  teamMembers: ICompanyTeamMember[];
  reviews?: ICompanyReview[];
  averageRating?: number;
  benefits?: string[];
  culture?: string[];
  mission?: string;
  vision?: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

