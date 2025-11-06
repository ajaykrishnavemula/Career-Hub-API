import mongoose from 'mongoose';
import { IJob } from '../interfaces/Job';

// Job location schema
const JobLocationSchema = new mongoose.Schema({
  city: {
    type: String,
    required: [true, 'Please provide city'],
    trim: true,
  },
  state: {
    type: String,
    trim: true,
  },
  country: {
    type: String,
    required: [true, 'Please provide country'],
    trim: true,
  },
  remote: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    enum: ['onsite', 'remote', 'hybrid'],
    default: 'onsite',
  },
});

// Salary range schema
const SalaryRangeSchema = new mongoose.Schema({
  min: {
    type: Number,
    min: 0,
  },
  max: {
    type: Number,
    min: 0,
  },
  currency: {
    type: String,
    required: [true, 'Please provide currency'],
    default: 'USD',
    trim: true,
  },
  period: {
    type: String,
    enum: ['hourly', 'daily', 'weekly', 'monthly', 'yearly'],
    default: 'yearly',
  },
  negotiable: {
    type: Boolean,
    default: false,
  },
});

// Benefits schema
const BenefitsSchema = new mongoose.Schema({
  healthInsurance: {
    type: Boolean,
    default: false,
  },
  paidTimeOff: {
    type: Boolean,
    default: false,
  },
  retirement: {
    type: Boolean,
    default: false,
  },
  flexibleHours: {
    type: Boolean,
    default: false,
  },
  remoteWork: {
    type: Boolean,
    default: false,
  },
  professionalDevelopment: {
    type: Boolean,
    default: false,
  },
  other: {
    type: [String],
  },
});

// Application question schema
const ApplicationQuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Please provide question'],
    trim: true,
  },
  required: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    enum: ['text', 'multiline', 'select', 'multiselect', 'boolean'],
    default: 'text',
  },
  options: {
    type: [String],
  },
});

// Job schema
const JobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'Please provide company name'],
      maxlength: 100,
      trim: true,
    },
    position: {
      type: String,
      required: [true, 'Please provide position'],
      maxlength: 100,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide job description'],
      trim: true,
    },
    location: {
      type: JobLocationSchema,
      required: [true, 'Please provide job location'],
    },
    salary: {
      type: SalaryRangeSchema,
    },
    benefits: {
      type: BenefitsSchema,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived', 'closed'],
      default: 'draft',
    },
    applicationStatus: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
    },
    jobType: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'internship', 'temporary'],
      default: 'full-time',
    },
    experience: {
      type: String,
      enum: ['entry', 'mid-level', 'senior', 'executive'],
      default: 'mid-level',
    },
    requirements: {
      type: [String],
      default: [],
    },
    responsibilities: {
      type: [String],
      default: [],
    },
    applicationQuestions: {
      type: [ApplicationQuestionSchema],
      default: [],
    },
    applicationDeadline: {
      type: Date,
    },
    categories: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user'],
    },
  },
  { timestamps: true }
);

// Create text indexes for search
JobSchema.index({
  position: 'text',
  company: 'text',
  description: 'text',
  'location.city': 'text',
  'location.country': 'text',
  categories: 'text',
  tags: 'text',
});

export default mongoose.model<IJob>('Job', JobSchema);

