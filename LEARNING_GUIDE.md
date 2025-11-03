# CareerHubAPI - Beginner's Learning Guide

## 📚 What is CareerHubAPI?

CareerHubAPI is a **job posting and applicant tracking system**. Think of it as the backend for job boards like LinkedIn Jobs or Indeed - it connects employers with job seekers, manages applications, and tracks the hiring process.

---

## 🎯 What Does This Project Do?

Imagine you're building a job board website. You need:
- Companies to post job openings
- Job seekers to apply for jobs
- Track application status (applied → interview → hired)
- Schedule interviews
- Message between employers and candidates
- Analytics on hiring metrics

**This project aims to do ALL of that!**

---

## ⚠️ IMPORTANT: Current Status

**🔴 CRITICAL BUG**: This project currently has a **blocking bug** that prevents it from starting!

### The Problem
The [`app.ts`](src/app.ts:14-20) file imports route files that don't exist:
```typescript
import authRoutes from './routes/auth';      // ❌ FILE MISSING
import jobsRoutes from './routes/jobs';      // ❌ FILE MISSING
import companiesRoutes from './routes/companies'; // ❌ FILE MISSING
```

### What This Means
- The application **cannot start**
- You'll get "Module not found" errors
- Need to either create these files or remove the imports

### What Works
Despite the bug, several features ARE implemented:
- ✅ Applicant management (complete)
- ✅ Analytics system (complete)
- ✅ Messaging system (complete)
- ✅ Search functionality (complete)

### What's Missing
- ❌ Authentication (no login/register)
- ❌ Job management (can't create/view jobs)
- ❌ Company management (no company profiles)

---

## 🏗️ Project Structure (How Files Are Organized)

```
CareerHubAPI/
├── src/                          # All source code lives here
│   ├── controllers/              # Handle requests (the "brain")
│   │   ├── applicant.ts         # ✅ Applicant management (589 lines!)
│   │   ├── analytics.ts         # ✅ Analytics (220 lines)
│   │   ├── messaging.ts         # ✅ Messaging (226 lines)
│   │   └── search.ts            # ✅ Search (4 functions)
│   ├── models/                   # Database structure
│   │   ├── User.ts              # User accounts
│   │   ├── Job.ts               # Job postings
│   │   ├── Company.ts           # Company profiles
│   │   ├── Applicant.ts         # Applicant profiles & applications
│   │   ├── Application.ts       # Job applications
│   │   ├── Interview.ts         # Interview scheduling
│   │   └── Message.ts           # Messaging system
│   ├── routes/                   # URL paths
│   │   ├── applicants.ts        # ✅ /api/v1/applicants/*
│   │   ├── analytics.ts         # ✅ /api/v1/analytics/*
│   │   ├── messaging.ts         # ✅ /api/v1/messages/*
│   │   ├── search.ts            # ✅ /api/v1/search/*
│   │   ├── auth.ts              # ❌ MISSING
│   │   ├── jobs.ts              # ❌ MISSING
│   │   └── companies.ts         # ❌ MISSING
│   ├── middleware/               # Code that runs before controllers
│   │   ├── auth.ts              # Check if user is logged in
│   │   └── rate-limiter.ts      # Prevent spam
│   ├── services/                 # Business logic
│   │   └── analytics.service.ts # Analytics calculations
│   ├── utils/                    # Helper functions
│   ├── config/                   # Settings
│   └── app.ts                    # Main application setup
├── .env                          # Secret keys
├── package.json                  # Project dependencies
└── tsconfig.json                 # TypeScript settings
```

---

## 🔑 Key Job Board Concepts

### 1. **Job Posting**

A job is an open position:
```typescript
{
  title: "Senior Software Engineer",
  company: "Tech Corp",
  location: "San Francisco, CA",
  jobType: "full-time",          // full-time, part-time, contract
  isRemote: true,
  salary: {
    min: 120000,
    max: 180000,
    currency: "USD"
  },
  description: "We're looking for...",
  requirements: ["5+ years experience", "React", "Node.js"],
  benefits: ["Health insurance", "401k"],
  applicationDeadline: "2024-12-31",
  status: "open"                 // open, closed, filled
}
```

### 2. **Applicant Profile**

Job seeker's information:
```typescript
{
  userId: ObjectId,
  headline: "Full Stack Developer",
  skills: [
    { name: "JavaScript", level: "expert" },
    { name: "React", level: "advanced" }
  ],
  workExperience: [
    {
      company: "Previous Corp",
      position: "Software Engineer",
      startDate: "2020-01",
      endDate: "2023-12",
      description: "Built web applications"
    }
  ],
  education: [
    {
      institution: "University",
      degree: "BS Computer Science",
      graduationYear: 2020
    }
  ],
  resume: {
    url: "/uploads/resume.pdf",
    uploadedAt: Date
  }
}
```

### 3. **Job Application**

When someone applies:
```typescript
{
  jobId: ObjectId,
  applicantId: ObjectId,
  status: "applied",             // applied → screening → interview → offer → hired/rejected
  resumeUrl: "/uploads/resume.pdf",
  coverLetter: "I'm interested because...",
  appliedAt: Date,
  interviews: [
    {
      scheduledFor: "2024-12-15T10:00:00Z",
      type: "phone",             // phone, video, in-person
      duration: 60,              // minutes
      location: "Zoom link",
      feedback: [
        {
          rating: 4,
          strengths: ["Good communication"],
          weaknesses: ["Needs more experience"],
          recommendation: "proceed"
        }
      ]
    }
  ]
}
```

### 4. **Application Status Flow**

Applications move through stages:
```
Applied → Screening → Interview → Offer → Hired
   ↓         ↓           ↓          ↓       ↓
Submit   Review      Meet      Negotiate  Accept
                                    ↓
                                Rejected (can happen at any stage)
```

### 5. **Interview Process**

Scheduling and feedback:
```typescript
{
  applicationId: ObjectId,
  scheduledFor: "2024-12-15T10:00:00Z",
  duration: 60,
  type: "video",
  location: "https://zoom.us/j/123",
  interviewers: [ObjectId],
  feedback: [
    {
      rating: 4,                 // 1-5
      strengths: ["Strong technical skills"],
      weaknesses: ["Limited leadership experience"],
      notes: "Good candidate overall",
      recommendation: "proceed", // proceed, reject, maybe
      createdBy: ObjectId
    }
  ]
}
```

---

## 📖 How the Code Works (What's Implemented)

### Example 1: Creating Applicant Profile

**What happens when a job seeker creates their profile?**

```typescript
// 1. User sends profile data
POST /api/v1/applicants/profile
{
  "headline": "Full Stack Developer",
  "skills": [
    { "name": "JavaScript", "level": "expert" }
  ],
  "workExperience": [...]
}

// 2. Code in applicant.ts controller runs:
export const createOrUpdateProfile = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  
  // Check if profile already exists
  let profile = await ApplicantProfile.findOne({ userId });
  
  if (profile) {
    // Update existing profile
    profile = await ApplicantProfile.findOneAndUpdate(
      { userId },
      req.body,
      { new: true, runValidators: true }
    );
  } else {
    // Create new profile
    profile = await ApplicantProfile.create({
      userId,
      ...req.body
    });
  }
  
  res.status(200).json({
    success: true,
    profile
  });
};
```

**Flow Diagram**:
```
User → Create Profile → Check if Exists → 
Update or Create → Save → Return Profile
```

### Example 2: Applying for a Job

**What happens when someone applies for a job?**

```typescript
// 1. User applies for job
POST /api/v1/applicants/jobs/job123/apply
{
  "resumeUrl": "/uploads/resume.pdf",
  "coverLetter": "I'm interested because..."
}

// 2. Code in applicant.ts controller runs:
export const applyForJob = async (req: Request, res: Response) => {
  const { jobId } = req.params;
  const userId = req.user?.userId;
  
  // Check if job exists
  const job = await Job.findById(jobId);
  if (!job) {
    throw new NotFoundError('Job not found');
  }
  
  // Check if application deadline passed
  if (job.applicationDeadline && new Date(job.applicationDeadline) < new Date()) {
    throw new BadRequestError('Application deadline has passed');
  }
  
  // Get applicant profile
  const applicantProfile = await ApplicantProfile.findOne({ userId });
  if (!applicantProfile) {
    throw new BadRequestError('Please create an applicant profile first');
  }
  
  // Check if already applied
  const existingApplication = await JobApplication.findOne({
    jobId,
    applicantId: applicantProfile._id
  });
  
  if (existingApplication) {
    throw new BadRequestError('You have already applied for this job');
  }
  
  // Create application
  const application = await JobApplication.create({
    jobId,
    applicantId: applicantProfile._id,
    resumeUrl: req.body.resumeUrl || applicantProfile.resume?.url,
    coverLetter: req.body.coverLetter,
    status: 'applied'
  });
  
  // Update job application count
  await Job.findByIdAndUpdate(jobId, {
    $inc: { applicationCount: 1 }
  });
  
  res.status(201).json({
    success: true,
    application
  });
};
```

**Flow Diagram**:
```
User → Apply for Job → Check Job Exists → Check Deadline → 
Get Profile → Check Already Applied → Create Application → 
Update Count → Return Application
```

### Example 3: Scheduling Interview (Employer)

**What happens when an employer schedules an interview?**

```typescript
// 1. Employer schedules interview
POST /api/v1/applicants/applications/app123/interviews
{
  "scheduledFor": "2024-12-15T10:00:00Z",
  "duration": 60,
  "type": "video",
  "location": "https://zoom.us/j/123"
}

// 2. Code in applicant.ts controller runs:
export const scheduleInterview = async (req: Request, res: Response) => {
  const { applicationId } = req.params;
  const { scheduledFor, duration, type, location } = req.body;
  const userId = req.user?.userId;
  
  // Check if user is employer
  const user = await User.findById(userId);
  if (user.role !== 'employer') {
    throw new UnauthenticatedError('Not authorized');
  }
  
  // Find application
  const application = await JobApplication.findById(applicationId);
  if (!application) {
    throw new NotFoundError('Application not found');
  }
  
  // Check if job belongs to employer
  const job = await Job.findById(application.jobId);
  if (job.createdBy.toString() !== userId) {
    throw new UnauthenticatedError('Not authorized');
  }
  
  // Update application status to interview
  if (application.status !== 'interview') {
    application.status = 'interview';
  }
  
  // Add interview to application
  application.interviews.push({
    scheduledFor: new Date(scheduledFor),
    duration,
    type,
    location
  });
  
  await application.save();
  
  res.status(200).json({
    success: true,
    message: 'Interview scheduled successfully',
    application
  });
};
```

**Flow Diagram**:
```
Employer → Schedule Interview → Check Authorization → 
Find Application → Verify Job Ownership → Update Status → 
Add Interview → Save → Return
```

---

## 🎨 Features Implemented (What Works)

### ✅ Applicant Management (15 Functions)
1. **Create/Update Profile** - Applicant profile
2. **Get Profile** - View profile
3. **Apply for Job** - Submit application
4. **Get My Applications** - View applications
5. **Get Application** - Application details
6. **Withdraw Application** - Cancel application
7. **Get Recommended Jobs** - Job suggestions
8. **Get Applicant by ID** - Employer view (employer)
9. **Update Application Status** - Change status (employer)
10. **Schedule Interview** - Set interview (employer)
11. **Add Interview Feedback** - Rate candidate (employer)
12. **Get Job Applications** - All applicants (employer)
13. **Get Application Stats** - Analytics (employer)
14. **Application tracking** - Status management
15. **Interview management** - Schedule & feedback

### ✅ Analytics System (5 Functions)
1. **Job Posting Analytics** - Job metrics
2. **Application Analytics** - Application trends
3. **Interview Analytics** - Interview data
4. **Applicant Analytics** - Candidate metrics (admin)
5. **Dashboard Analytics** - Combined overview

### ✅ Messaging System (7 Functions)
1. **Get Conversations** - List chats
2. **Get Messages** - View conversation
3. **Send Message** - New message
4. **Mark as Read** - Read receipt
5. **Delete Message** - Remove message
6. **Get Unread Count** - Notification count
7. **Search Messages** - Find messages

### ✅ Search Functionality (4 Functions)
1. **Search Jobs** - Find jobs
2. **Search Applicants** - Find candidates (employer)
3. **Job Recommendations** - Suggest jobs
4. **Candidate Recommendations** - Suggest candidates (employer)

---

## ❌ Features NOT Implemented (Critical Missing)

### 🚨 Authentication System (CRITICAL)
- ❌ User registration
- ❌ User login
- ❌ JWT token generation
- ❌ Password hashing
- ❌ Email verification
- ❌ Password reset

**Impact**: Cannot use the API at all!

### 🚨 Job Management (CRITICAL)
- ❌ Create job posting
- ❌ Get all jobs
- ❌ Get job by ID
- ❌ Update job
- ❌ Delete job
- ❌ Job status management

**Impact**: No jobs to apply for!

### 🚨 Company Management (CRITICAL)
- ❌ Create company profile
- ❌ Get company details
- ❌ Update company
- ❌ Company verification
- ❌ Team management

**Impact**: No employer profiles!

---

## 📊 Database Models Explained

### User Model (✅ Exists, ❌ No Controllers)
```typescript
{
  name: "John Doe",
  email: "john@example.com",
  password: "hashed_password",
  role: "applicant",           // applicant, employer, admin
  isEmailVerified: false,
  createdAt: Date
}
```

### Job Model (✅ Exists, ❌ No Controllers)
```typescript
{
  title: "Senior Software Engineer",
  company: ObjectId,
  location: "San Francisco, CA",
  jobType: "full-time",
  isRemote: true,
  salary: {
    min: 120000,
    max: 180000
  },
  description: "...",
  requirements: ["..."],
  status: "open",
  applicationCount: 0,
  createdBy: ObjectId,
  createdAt: Date
}
```

### ApplicantProfile Model (✅ Fully Implemented)
```typescript
{
  userId: ObjectId,
  headline: "Full Stack Developer",
  skills: [
    { name: "JavaScript", level: "expert" }
  ],
  workExperience: [...],
  education: [...],
  resume: {
    url: "/uploads/resume.pdf"
  },
  preferredJobTypes: ["full-time"],
  isRemoteOnly: false
}
```

### JobApplication Model (✅ Fully Implemented)
```typescript
{
  jobId: ObjectId,
  applicantId: ObjectId,
  status: "applied",
  resumeUrl: "/uploads/resume.pdf",
  coverLetter: "...",
  appliedAt: Date,
  interviews: [...],
  notes: [...]
}
```

---

## 🔧 What Needs to Be Fixed/Implemented

### Priority 1: Fix Critical Bug (URGENT)
```typescript
// Option 1: Create missing route files
// Create: src/routes/auth.ts
// Create: src/routes/jobs.ts
// Create: src/routes/companies.ts

// Option 2: Remove broken imports from app.ts
// Remove lines 14-16 and 79-81 in app.ts
```

### Priority 2: Implement Authentication
```typescript
// Need to create:
1. Auth controller (register, login, etc.)
2. Auth routes
3. JWT token generation
4. Password hashing with bcrypt
```

### Priority 3: Implement Job Management
```typescript
// Need to create:
1. Job controller (CRUD operations)
2. Job routes
3. Job search and filtering
4. Job status management
```

### Priority 4: Implement Company Management
```typescript
// Need to create:
1. Company controller
2. Company routes
3. Company verification
4. Team management
```

---

## 🚀 How to Use This API (After Fixes)

### Current Status
⚠️ **Cannot use yet** - Application won't start due to missing files

### After Fixes
```bash
# 1. Install dependencies
npm install

# 2. Create .env file
PORT=5000
MONGO_URI=mongodb://localhost:27017/careerhub
JWT_SECRET=your-secret-key

# 3. Start server
npm run dev
```

---

## 🎓 Learning Path

### What You Can Learn Now
1. ✅ Study applicant management code
2. ✅ Understand application workflow
3. ✅ Learn interview scheduling
4. ✅ Study messaging system
5. ✅ Understand analytics

### What to Learn After Fixes
1. Authentication implementation
2. Job posting system
3. Company management
4. Complete job board workflow

---

## 💡 Tips for Understanding This Project

### Start Here
1. Read [`applicant.ts`](src/controllers/applicant.ts) - See how applications work
2. Look at [`Applicant.ts`](src/models/Applicant.ts) model - Understand data structure
3. Check [`analytics.ts`](src/controllers/analytics.ts) - See metrics
4. Study [`messaging.ts`](src/controllers/messaging.ts) - Learn messaging

### What Makes This Different
- **Applicant-focused**: Strong applicant features
- **Interview management**: Detailed interview tracking
- **Analytics**: Good metrics and reporting
- **Messaging**: Built-in communication

### What's Missing
- **No authentication**: Can't log in
- **No jobs**: Nothing to apply for
- **No companies**: No employer profiles

---

## 🔮 Future Enhancements (After Core Features)

1. Resume parsing (extract skills automatically)
2. AI-powered job matching
3. Video interview integration
4. Skills assessment tests
5. Reference checking
6. Background verification
7. Salary negotiation tools
8. Offer letter generation

---

**Remember**: This project has excellent applicant tracking features, but needs the core authentication and job management to be functional. Once those are implemented, it will be a complete job board system!

**Status**: 🔴 **Needs critical fixes before use**  
**Next Step**: Fix missing route files and implement authentication

**Happy Learning! 💼**