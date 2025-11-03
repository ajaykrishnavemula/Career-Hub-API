import mongoose from 'mongoose';
import { IApplication } from '../interfaces/Application';

const ApplicationSchema = new mongoose.Schema<IApplication>(
  {
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ApplicantProfile',
      required: [true, 'Applicant is required'],
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Job is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'reviewing', 'interviewing', 'rejected', 'hired'],
      default: 'pending',
    },
    coverLetter: {
      type: String,
      maxlength: [5000, 'Cover letter cannot be more than 5000 characters'],
    },
    resume: {
      url: {
        type: String,
        required: [true, 'Resume URL is required'],
      },
      filename: {
        type: String,
        required: [true, 'Resume filename is required'],
      },
    },
    additionalDocuments: [
      {
        url: {
          type: String,
          required: true,
        },
        filename: {
          type: String,
          required: true,
        },
        documentType: {
          type: String,
          required: true,
        },
      },
    ],
    notes: [
      {
        content: {
          type: String,
          required: true,
        },
        createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    rejectionReason: {
      type: String,
      maxlength: [1000, 'Rejection reason cannot be more than 1000 characters'],
    },
    interviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Interview',
      },
    ],
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    lastStatusUpdateAt: {
      type: Date,
      default: Date.now,
    },
    lastStatusUpdateBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// Index for faster queries
ApplicationSchema.index({ applicant: 1, job: 1 }, { unique: true });
ApplicationSchema.index({ job: 1 });
ApplicationSchema.index({ status: 1 });
ApplicationSchema.index({ createdAt: 1 });

// Create a text index for searching
ApplicationSchema.index({
  'notes.content': 'text',
  coverLetter: 'text',
});

export default mongoose.model<IApplication>('Application', ApplicationSchema);

// Made with Bob
