import mongoose from 'mongoose';

export interface IInterview extends mongoose.Document {
  application: mongoose.Types.ObjectId;
  type: 'phone' | 'video' | 'onsite' | 'technical' | 'behavioral';
  scheduledAt: Date;
  duration: number; // in minutes
  location?: string;
  meetingLink?: string;
  interviewers: Array<{
    userId: mongoose.Types.ObjectId;
    name: string;
    email: string;
    role: string;
  }>;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  feedback?: Array<{
    interviewer: mongoose.Types.ObjectId;
    rating: number;
    strengths: string[];
    weaknesses: string[];
    notes: string;
    recommendation: 'strong_yes' | 'yes' | 'maybe' | 'no' | 'strong_no';
    createdAt: Date;
  }>;
  notes?: string;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

