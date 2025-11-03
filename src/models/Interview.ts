import mongoose from 'mongoose';
import { IInterview } from '../interfaces/Interview';

const InterviewSchema = new mongoose.Schema<IInterview>(
  {
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: [true, 'Application is required'],
    },
    type: {
      type: String,
      enum: ['phone', 'video', 'onsite', 'technical', 'behavioral'],
      required: [true, 'Interview type is required'],
    },
    scheduledAt: {
      type: Date,
      required: [true, 'Interview schedule time is required'],
    },
    duration: {
      type: Number,
      required: [true, 'Interview duration is required'],
      min: [15, 'Interview duration must be at least 15 minutes'],
    },
    location: {
      type: String,
    },
    meetingLink: {
      type: String,
    },
    interviewers: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        email: {
          type: String,
          required: true,
        },
        role: {
          type: String,
          required: true,
        },
      },
    ],
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled', 'rescheduled'],
      default: 'scheduled',
    },
    feedback: [
      {
        interviewer: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        strengths: [String],
        weaknesses: [String],
        notes: {
          type: String,
          required: true,
        },
        recommendation: {
          type: String,
          enum: ['strong_yes', 'yes', 'maybe', 'no', 'strong_no'],
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    notes: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Indexes for faster queries
InterviewSchema.index({ application: 1 });
InterviewSchema.index({ scheduledAt: 1 });
InterviewSchema.index({ status: 1 });
InterviewSchema.index({ 'interviewers.userId': 1 });

export default mongoose.model<IInterview>('Interview', InterviewSchema);

// Made with Bob
