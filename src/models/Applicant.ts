import mongoose from 'mongoose';
import { IApplicantProfile, IJobApplication } from '../interfaces/Applicant';

// Education schema
const EducationSchema = new mongoose.Schema({
  institution: {
    type: String,
    required: [true, 'Please provide institution name'],
    trim: true,
  },
  degree: {
    type: String,
    required: [true, 'Please provide degree'],
    trim: true,
  },
  field: {
    type: String,
    required: [true, 'Please provide field of study'],
    trim: true,
  },
  startDate: {
    type: Date,
    required: [true, 'Please provide start date'],
  },
  endDate: {
    type: Date,
  },
  current: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
    trim: true,
  },
});

// Work experience schema
const WorkExperienceSchema = new mongoose.Schema({
  company: {
    type: String,
    required: [true, 'Please provide company name'],
    trim: true,
  },
  position: {
    type: String,
    required: [true, 'Please provide position'],
    trim: true,
  },
  location: {
    type: String,
    trim: true,
  },
  startDate: {
    type: Date,
    required: [true, 'Please provide start date'],
  },
  endDate: {
    type: Date,
  },
  current: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
    trim: true,
  },
});

// Skill schema
const SkillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide skill name'],
    trim: true,
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'intermediate',
  },
  yearsOfExperience: {
    type: Number,
    min: 0,
  },
});

// Project schema
const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide project title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide project description'],
    trim: true,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  url: {
    type: String,
    trim: true,
  },
  technologies: {
    type: [String],
    default: [],
  },
});

// Certificate schema
const CertificateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide certificate name'],
    trim: true,
  },
  issuer: {
    type: String,
    required: [true, 'Please provide issuer'],
    trim: true,
  },
  issueDate: {
    type: Date,
    required: [true, 'Please provide issue date'],
  },
  expiryDate: {
    type: Date,
  },
  credentialId: {
    type: String,
    trim: true,
  },
  url: {
    type: String,
    trim: true,
  },
});

// Language schema
const LanguageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide language name'],
    trim: true,
  },
  proficiency: {
    type: String,
    enum: ['basic', 'conversational', 'fluent', 'native'],
    default: 'conversational',
  },
});

// Social profile schema
const SocialProfileSchema = new mongoose.Schema({
  platform: {
    type: String,
    enum: ['linkedin', 'github', 'twitter', 'portfolio', 'other'],
    required: [true, 'Please provide platform'],
  },
  url: {
    type: String,
    required: [true, 'Please provide URL'],
    trim: true,
  },
});

// Applicant profile schema
const ApplicantProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user ID'],
      unique: true,
    },
    headline: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    summary: {
      type: String,
      trim: true,
    },
    location: {
      city: {
        type: String,
        trim: true,
      },
      state: {
        type: String,
        trim: true,
      },
      country: {
        type: String,
        trim: true,
      },
    },
    phone: {
      type: String,
      trim: true,
    },
    education: {
      type: [EducationSchema],
      default: [],
    },
    workExperience: {
      type: [WorkExperienceSchema],
      default: [],
    },
    skills: {
      type: [SkillSchema],
      default: [],
    },
    projects: {
      type: [ProjectSchema],
      default: [],
    },
    certificates: {
      type: [CertificateSchema],
      default: [],
    },
    languages: {
      type: [LanguageSchema],
      default: [],
    },
    socialProfiles: {
      type: [SocialProfileSchema],
      default: [],
    },
    resume: {
      url: {
        type: String,
        trim: true,
      },
      filename: {
        type: String,
        trim: true,
      },
      uploadDate: {
        type: Date,
      },
    },
    preferredJobTypes: {
      type: [String],
      enum: ['full-time', 'part-time', 'contract', 'internship', 'temporary'],
      default: [],
    },
    preferredLocations: {
      type: [String],
      default: [],
    },
    preferredIndustries: {
      type: [String],
      default: [],
    },
    isRemoteOnly: {
      type: Boolean,
      default: false,
    },
    salaryExpectation: {
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
        default: 'USD',
      },
      period: {
        type: String,
        enum: ['hourly', 'daily', 'weekly', 'monthly', 'yearly'],
        default: 'yearly',
      },
    },
    availability: {
      immediate: {
        type: Boolean,
        default: true,
      },
      availableFrom: {
        type: Date,
      },
      noticePeriod: {
        type: Number,
        min: 0,
      },
    },
  },
  { timestamps: true }
);

// Job application schema
const JobApplicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Please provide job ID'],
    },
    applicantId: {
      type: mongoose.Types.ObjectId,
      ref: 'ApplicantProfile',
      required: [true, 'Please provide applicant ID'],
    },
    resumeUrl: {
      type: String,
      trim: true,
    },
    coverLetter: {
      type: String,
      trim: true,
    },
    answers: [
      {
        questionId: {
          type: String,
          required: true,
        },
        question: {
          type: String,
          required: true,
        },
        answer: {
          type: String,
          required: true,
        },
      },
    ],
    status: {
      type: String,
      enum: [
        'applied',
        'screening',
        'interview',
        'offer',
        'hired',
        'rejected',
        'withdrawn',
      ],
      default: 'applied',
    },
    notes: [
      {
        content: {
          type: String,
          required: true,
        },
        createdBy: {
          type: mongoose.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    interviews: [
      {
        scheduledFor: {
          type: Date,
          required: true,
        },
        duration: {
          type: Number,
          required: true,
          min: 1,
        },
        type: {
          type: String,
          enum: ['phone', 'video', 'in-person'],
          required: true,
        },
        location: {
          type: String,
        },
        interviewers: [
          {
            type: mongoose.Types.ObjectId,
            ref: 'User',
          },
        ],
        feedback: [
          {
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
            },
            recommendation: {
              type: String,
              enum: ['strong_yes', 'yes', 'maybe', 'no', 'strong_no'],
              required: true,
            },
            createdBy: {
              type: mongoose.Types.ObjectId,
              ref: 'User',
              required: true,
            },
            createdAt: {
              type: Date,
              default: Date.now,
            },
          },
        ],
      },
    ],
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Create text indexes for search
ApplicantProfileSchema.index({
  headline: 'text',
  summary: 'text',
  'skills.name': 'text',
  'workExperience.position': 'text',
  'workExperience.company': 'text',
  'education.field': 'text',
});

// Create compound index for job applications
JobApplicationSchema.index({ jobId: 1, applicantId: 1 }, { unique: true });

export const ApplicantProfile = mongoose.model<IApplicantProfile>(
  'ApplicantProfile',
  ApplicantProfileSchema
);

export const JobApplication = mongoose.model<IJobApplication>(
  'JobApplication',
  JobApplicationSchema
);

// Made with Bob
