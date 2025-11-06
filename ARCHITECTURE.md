# Career Hub - System Architecture

## 📋 Table of Contents
- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Backend Architecture](#backend-architecture)
- [Frontend Architecture](#frontend-architecture)
- [Database Schema](#database-schema)
- [API Design](#api-design)
- [Authentication & Authorization](#authentication--authorization)
- [State Management](#state-management)
- [Deployment Architecture](#deployment-architecture)

## 🎯 Overview

Career Hub is a full-stack job portal application that connects job seekers with employers. The system is built using modern web technologies with a focus on scalability, maintainability, and user experience.

### Key Features
- Job search and filtering
- Application management
- User authentication and authorization
- Real-time notifications (planned)
- Company profiles
- Resume management

### Technology Stack

**Backend:**
- Node.js + Express.js
- MongoDB with Mongoose
- JWT Authentication
- Elasticsearch (for advanced search)

**Frontend:**
- React 19 + TypeScript
- Vite 7.2
- Tailwind CSS v4
- Zustand (State Management)
- React Router v7
- Axios

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Browser    │  │    Mobile    │  │   Desktop    │      │
│  │  (React App) │  │  (Planned)   │  │  (Planned)   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS/REST API
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway Layer                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Express.js API Server                    │   │
│  │  - Rate Limiting                                      │   │
│  │  - CORS Configuration                                 │   │
│  │  - Request Validation                                 │   │
│  │  - Error Handling                                     │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     Application Layer                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │     Auth     │  │     Jobs     │  │ Applications │      │
│  │   Service    │  │   Service    │  │   Service    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Company    │  │    User      │  │   Search     │      │
│  │   Service    │  │   Service    │  │   Service    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                       Data Layer                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   MongoDB    │  │ Elasticsearch│  │    Redis     │      │
│  │  (Primary)   │  │   (Search)   │  │   (Cache)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 Backend Architecture

### Directory Structure

```
backend/
├── src/
│   ├── config/              # Configuration files
│   │   └── index.ts         # Environment config
│   ├── controllers/         # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── job.controller.ts
│   │   ├── application.controller.ts
│   │   └── company.controller.ts
│   ├── models/              # Mongoose models
│   │   ├── User.ts
│   │   ├── Job.ts
│   │   ├── Application.ts
│   │   └── Company.ts
│   ├── routes/              # API routes
│   │   ├── auth.routes.ts
│   │   ├── job.routes.ts
│   │   ├── application.routes.ts
│   │   └── company.routes.ts
│   ├── middleware/          # Custom middleware
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   └── error.middleware.ts
│   ├── services/            # Business logic
│   │   ├── auth.service.ts
│   │   ├── job.service.ts
│   │   ├── email.service.ts
│   │   └── search.service.ts
│   ├── utils/               # Utility functions
│   │   ├── jwt.util.ts
│   │   ├── validation.util.ts
│   │   └── logger.util.ts
│   ├── types/               # TypeScript types
│   └── index.ts             # Entry point
├── tests/                   # Test files
├── package.json
└── tsconfig.json
```

### API Layers

1. **Routes Layer**: Defines API endpoints and maps them to controllers
2. **Controller Layer**: Handles HTTP requests/responses
3. **Service Layer**: Contains business logic
4. **Model Layer**: Database schema and data access
5. **Middleware Layer**: Request processing (auth, validation, etc.)

### Key Design Patterns

- **MVC Pattern**: Separation of concerns
- **Repository Pattern**: Data access abstraction
- **Dependency Injection**: Loose coupling
- **Factory Pattern**: Object creation
- **Middleware Pattern**: Request processing pipeline

## 💻 Frontend Architecture

### Directory Structure

```
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # Base UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── ...
│   │   ├── jobs/           # Job-specific components
│   │   │   ├── JobCard.tsx
│   │   │   ├── JobFilters.tsx
│   │   │   └── ApplicationCard.tsx
│   │   └── layout/         # Layout components
│   │       ├── Header.tsx
│   │       ├── Footer.tsx
│   │       └── MainLayout.tsx
│   ├── pages/              # Page components
│   │   ├── auth/
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   ├── Home.tsx
│   │   ├── Jobs.tsx
│   │   ├── JobDetail.tsx
│   │   └── Applications.tsx
│   ├── services/           # API services
│   │   ├── api.ts
│   │   ├── auth.service.ts
│   │   ├── job.service.ts
│   │   └── application.service.ts
│   ├── store/              # State management
│   │   ├── authStore.ts
│   │   └── jobStore.ts
│   ├── types/              # TypeScript types
│   │   └── index.ts
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── public/                 # Static assets
├── package.json
└── vite.config.ts
```

### Component Architecture

```
┌─────────────────────────────────────────┐
│              App.tsx                     │
│         (Router Setup)                   │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│          MainLayout                      │
│  ┌────────────────────────────────┐     │
│  │         Header                  │     │
│  └────────────────────────────────┘     │
│  ┌────────────────────────────────┐     │
│  │         Outlet (Pages)          │     │
│  │  - Home                         │     │
│  │  - Jobs                         │     │
│  │  - JobDetail                    │     │
│  │  - Applications                 │     │
│  └────────────────────────────────┘     │
│  ┌────────────────────────────────┐     │
│  │         Footer                  │     │
│  └────────────────────────────────┘     │
└─────────────────────────────────────────┘
```

### State Management Flow

```
┌──────────────┐
│  Component   │
└──────────────┘
       │
       │ useStore()
       ▼
┌──────────────┐
│ Zustand Store│
└──────────────┘
       │
       │ API Call
       ▼
┌──────────────┐
│   Service    │
└──────────────┘
       │
       │ HTTP Request
       ▼
┌──────────────┐
│   Backend    │
└──────────────┘
```

## 🗄️ Database Schema

### User Collection

```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique, indexed),
  password: String (hashed),
  role: Enum['user', 'employer', 'admin'],
  isEmailVerified: Boolean,
  profile: {
    phone: String,
    location: String,
    bio: String,
    resume: String,
    skills: [String]
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Job Collection

```javascript
{
  _id: ObjectId,
  title: String (indexed),
  description: String,
  company: ObjectId (ref: Company),
  location: String (indexed),
  type: Enum['full-time', 'part-time', 'contract', 'internship'],
  experience: Enum['entry', 'mid', 'senior'],
  salary: {
    min: Number,
    max: Number,
    currency: String
  },
  skills: [String] (indexed),
  remote: Boolean (indexed),
  status: Enum['active', 'closed', 'draft'],
  applicants: Number,
  views: Number,
  postedBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### Application Collection

```javascript
{
  _id: ObjectId,
  job: ObjectId (ref: Job),
  applicant: ObjectId (ref: User),
  status: Enum['pending', 'reviewing', 'shortlisted', 'rejected', 'accepted'],
  coverLetter: String,
  resume: String,
  appliedDate: Date,
  lastUpdated: Date,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Company Collection

```javascript
{
  _id: ObjectId,
  name: String (indexed),
  logo: String,
  description: String,
  industry: String,
  size: String,
  location: String,
  website: String,
  owner: ObjectId (ref: User),
  activeJobs: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Indexes

```javascript
// User indexes
db.users.createIndex({ email: 1 }, { unique: true })

// Job indexes
db.jobs.createIndex({ title: "text", description: "text" })
db.jobs.createIndex({ location: 1, type: 1, experience: 1 })
db.jobs.createIndex({ skills: 1 })
db.jobs.createIndex({ createdAt: -1 })

// Application indexes
db.applications.createIndex({ job: 1, applicant: 1 }, { unique: true })
db.applications.createIndex({ applicant: 1, status: 1 })
db.applications.createIndex({ job: 1, status: 1 })
```

## 🔌 API Design

### RESTful Endpoints

#### Authentication
```
POST   /api/auth/register          # Register new user
POST   /api/auth/login             # Login user
POST   /api/auth/logout            # Logout user
GET    /api/auth/me                # Get current user
POST   /api/auth/verify-email      # Verify email
POST   /api/auth/forgot-password   # Request password reset
POST   /api/auth/reset-password    # Reset password
```

#### Jobs
```
GET    /api/jobs                   # Get all jobs (with filters)
GET    /api/jobs/:id               # Get job by ID
POST   /api/jobs                   # Create job (employer only)
PUT    /api/jobs/:id               # Update job (employer only)
DELETE /api/jobs/:id               # Delete job (employer only)
GET    /api/jobs/search            # Advanced search
```

#### Applications
```
GET    /api/applications           # Get user's applications
GET    /api/applications/:id       # Get application by ID
POST   /api/applications           # Create application
DELETE /api/applications/:id       # Withdraw application
GET    /api/jobs/:id/applications  # Get job applications (employer)
PATCH  /api/applications/:id/status # Update status (employer)
```

#### Companies
```
GET    /api/companies              # Get all companies
GET    /api/companies/:id          # Get company by ID
POST   /api/companies              # Create company (employer)
PUT    /api/companies/:id          # Update company (employer)
DELETE /api/companies/:id          # Delete company (employer)
```

### API Response Format

```typescript
// Success Response
{
  success: true,
  data: {
    // Response data
  },
  message: "Success message"
}

// Error Response
{
  success: false,
  error: "Error message",
  details: {
    // Error details
  }
}

// Paginated Response
{
  success: true,
  data: {
    items: [...],
    pagination: {
      currentPage: 1,
      totalPages: 10,
      totalItems: 100,
      itemsPerPage: 10
    }
  }
}
```

## 🔐 Authentication & Authorization

### JWT Authentication Flow

```
1. User Login
   ↓
2. Server validates credentials
   ↓
3. Server generates JWT token
   ↓
4. Client stores token (localStorage)
   ↓
5. Client includes token in requests
   ↓
6. Server validates token
   ↓
7. Server processes request
```

### Token Structure

```javascript
{
  header: {
    alg: "HS256",
    typ: "JWT"
  },
  payload: {
    userId: "user_id",
    email: "user@example.com",
    role: "user",
    iat: 1234567890,
    exp: 1234567890
  },
  signature: "..."
}
```

### Authorization Levels

1. **Public**: No authentication required
2. **Authenticated**: Valid JWT token required
3. **Employer**: Employer role required
4. **Admin**: Admin role required

## 📊 State Management

### Zustand Stores

#### Auth Store
```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials) => Promise<void>;
  register: (data) => Promise<void>;
  logout: () => void;
  getProfile: () => Promise<void>;
}
```

#### Job Store
```typescript
interface JobState {
  jobs: Job[];
  currentJob: Job | null;
  isLoading: boolean;
  error: string | null;
  fetchJobs: (filters) => Promise<void>;
  fetchJobById: (id) => Promise<void>;
  clearJobs: () => void;
}
```

### State Persistence

- Auth state persisted to localStorage
- Automatic rehydration on app load
- Token refresh on expiration

## 🚀 Deployment Architecture

### Production Setup

```
┌─────────────────────────────────────────┐
│           CDN (Cloudflare)              │
│         (Static Assets)                 │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│        Vercel (Frontend)                │
│      - React Application                │
│      - Automatic Deployments            │
│      - Edge Functions                   │
└─────────────────────────────────────────┘
                  │
                  │ API Calls
                  ▼
┌─────────────────────────────────────────┐
│       Railway (Backend)                 │
│      - Node.js API Server               │
│      - Auto-scaling                     │
│      - Health Checks                    │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│      MongoDB Atlas                      │
│      - Managed Database                 │
│      - Automatic Backups                │
│      - Replication                      │
└─────────────────────────────────────────┘
```

### CI/CD Pipeline

```
1. Code Push to GitHub
   ↓
2. GitHub Actions Triggered
   ↓
3. Run Tests
   ↓
4. Build Application
   ↓
5. Deploy to Staging
   ↓
6. Run E2E Tests
   ↓
7. Deploy to Production
```

## 🔍 Performance Optimization

### Frontend
- Code splitting with React.lazy()
- Image optimization
- Bundle size optimization
- Caching strategies
- Lazy loading

### Backend
- Database indexing
- Query optimization
- Caching with Redis
- Connection pooling
- Rate limiting

## 🔒 Security Measures

1. **Authentication**: JWT with secure httpOnly cookies
2. **Authorization**: Role-based access control
3. **Input Validation**: Request validation middleware
4. **SQL Injection**: Mongoose parameterized queries
5. **XSS Protection**: Content Security Policy
6. **CSRF Protection**: CSRF tokens
7. **Rate Limiting**: Request throttling
8. **HTTPS**: SSL/TLS encryption
9. **Password Hashing**: bcrypt
10. **Environment Variables**: Secure configuration

## 📈 Monitoring & Logging

- Application logs with Winston
- Error tracking with Sentry
- Performance monitoring
- API analytics
- User behavior tracking

## 🧪 Testing Strategy

### Backend Testing
- Unit tests (Jest)
- Integration tests (Supertest)
- API tests (Postman/Newman)

### Frontend Testing
- Unit tests (Jest + React Testing Library)
- Component tests
- E2E tests (Cypress)

## 📚 Documentation

- API documentation (Swagger/OpenAPI)
- Code documentation (JSDoc/TSDoc)
- Architecture diagrams
- User guides
- Developer guides

---

**Last Updated**: November 2025  
**Version**: 1.0.0  
**Maintainer**: Development Team