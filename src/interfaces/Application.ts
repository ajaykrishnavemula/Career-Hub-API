import mongoose from 'mongoose';

export interface IApplication extends mongoose.Document {
  applicant: mongoose.Types.ObjectId;
  job: mongoose.Types.ObjectId;
  status: 'pending' | 'reviewing' | 'interviewing' | 'rejected' | 'hired';
  coverLetter?: string;
  resume: {
    url: string;
    filename: string;
  };
  additionalDocuments?: Array<{
    url: string;
    filename: string;
    documentType: string;
  }>;
  notes?: Array<{
    content: string;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
  }>;
  rejectionReason?: string;
  interviews?: mongoose.Types.ObjectId[];
  appliedAt: Date;
  lastStatusUpdateAt: Date;
  lastStatusUpdateBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Made with Bob
