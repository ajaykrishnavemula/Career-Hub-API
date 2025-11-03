import mongoose from 'mongoose';
import { ICompany } from '../interfaces/Company';

// Company location schema
const CompanyLocationSchema = new mongoose.Schema({
  address: {
    type: String,
    trim: true,
  },
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
  postalCode: {
    type: String,
    trim: true,
  },
});

// Company social media schema
const CompanySocialMediaSchema = new mongoose.Schema({
  website: {
    type: String,
    trim: true,
  },
  linkedin: {
    type: String,
    trim: true,
  },
  twitter: {
    type: String,
    trim: true,
  },
  facebook: {
    type: String,
    trim: true,
  },
  instagram: {
    type: String,
    trim: true,
  },
  github: {
    type: String,
    trim: true,
  },
});

// Company team member schema
const CompanyTeamMemberSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide user ID'],
  },
  role: {
    type: String,
    enum: ['owner', 'admin', 'recruiter', 'viewer'],
    default: 'viewer',
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

// Company review schema
const CompanyReviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide user ID'],
  },
  rating: {
    type: Number,
    required: [true, 'Please provide rating'],
    min: 1,
    max: 5,
  },
  title: {
    type: String,
    required: [true, 'Please provide review title'],
    trim: true,
    maxlength: 100,
  },
  review: {
    type: String,
    required: [true, 'Please provide review content'],
    trim: true,
  },
  pros: {
    type: String,
    trim: true,
  },
  cons: {
    type: String,
    trim: true,
  },
  isAnonymous: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Company schema
const CompanySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide company name'],
      maxlength: 100,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide company description'],
      trim: true,
    },
    shortDescription: {
      type: String,
      maxlength: 200,
      trim: true,
    },
    logo: {
      type: String,
      trim: true,
    },
    coverImage: {
      type: String,
      trim: true,
    },
    industry: {
      type: [String],
      required: [true, 'Please provide at least one industry'],
    },
    companySize: {
      type: String,
      enum: ['solo', '2-10', '11-50', '51-200', '201-500', '501-1000', '1000+'],
      required: [true, 'Please provide company size'],
    },
    founded: {
      type: Date,
    },
    locations: {
      type: [CompanyLocationSchema],
      default: [],
    },
    headquarters: {
      type: CompanyLocationSchema,
    },
    socialMedia: {
      type: CompanySocialMediaSchema,
    },
    website: {
      type: String,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationDate: {
      type: Date,
    },
    teamMembers: {
      type: [CompanyTeamMemberSchema],
      default: [],
    },
    reviews: {
      type: [CompanyReviewSchema],
      default: [],
    },
    averageRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    benefits: {
      type: [String],
      default: [],
    },
    culture: {
      type: [String],
      default: [],
    },
    mission: {
      type: String,
      trim: true,
    },
    vision: {
      type: String,
      trim: true,
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
CompanySchema.index({
  name: 'text',
  description: 'text',
  shortDescription: 'text',
  industry: 'text',
  'locations.city': 'text',
  'locations.country': 'text',
});

// Pre-save hook to generate slug from company name
CompanySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
  next();
});

// Method to calculate average rating
CompanySchema.methods.calculateAverageRating = function () {
  const approvedReviews = this.reviews.filter(
    (review: any) => review.status === 'approved'
  );
  
  if (approvedReviews.length === 0) {
    this.averageRating = 0;
    return;
  }
  
  const sum = approvedReviews.reduce(
    (total: number, review: any) => total + review.rating,
    0
  );
  
  this.averageRating = Math.round((sum / approvedReviews.length) * 10) / 10;
};

export default mongoose.model<ICompany>('Company', CompanySchema);

// Made with Bob
