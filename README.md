# Advanced Jobs API

A comprehensive job posting and applicant tracking API built with TypeScript, Express, and MongoDB. This project has been enhanced through three phases of development to include advanced features like applicant tracking, Elasticsearch integration, analytics, and messaging.

## Development Phases

This project was enhanced through three major development phases:

### Phase 1: Foundation Upgrade
- Migrated the codebase to TypeScript
- Enhanced existing job model
- Set up testing infrastructure
- Improved error handling and logging

### Phase 2: Core Feature Enhancement
- Added company profiles with verification
- Enhanced job listings with additional fields
- Implemented basic application submission
- Improved search capabilities

### Phase 3: Advanced Features
- Implemented comprehensive applicant tracking system
- Added advanced search with Elasticsearch
- Created analytics dashboards for employers and admins
- Implemented messaging system between employers and applicants

## Project Overview

This project provides a robust API for job posting, company profiles, and applicant tracking with advanced features:

- **Enhanced Job Management**: Rich job descriptions, multiple locations, salary ranges, benefits, and more
- **Company Profiles**: Company registration, verification, team management, and reviews
- **Applicant Tracking**: Resume parsing, application status tracking, interview scheduling
- **Advanced Search**: Elasticsearch-powered search, filtering, and sorting capabilities
- **Analytics**: Job performance metrics, applicant funnel analytics, and custom reports
- **Messaging**: In-app communication between employers and candidates
- **Security**: JWT authentication, role-based access control, rate limiting

## Project Architecture

The application follows a clean architecture with clear separation of concerns:

### Core Components

1. **Authentication System**:
   - User registration and login
   - JWT token-based authentication
   - Role-based access control
   - Email verification

2. **Job Management**:
   - Create, read, update, delete jobs
   - Rich job descriptions with markdown
   - Multiple job locations
   - Salary ranges and benefits
   - Application deadlines
   - Job categories and tags

3. **Company Profiles**:
   - Company registration and verification
   - Team member management
   - Company reviews and ratings
   - Multiple locations
   - Social media links

4. **Applicant Tracking**:
   - Applicant profiles with education, experience, skills
   - Resume/CV storage and parsing
   - Application status tracking
   - Interview scheduling
   - Candidate evaluation
   - Automated email communications
   - Application pipeline management

5. **Search & Filtering**:
   - Elasticsearch integration for powerful search
   - Full-text search across jobs and companies
   - Filter by location, job type, salary range, etc.
   - Sort by relevance, date, etc.
   - Job recommendations based on skills
   - Saved searches and alerts

6. **Analytics & Reporting**:
   - Job performance metrics
   - Applicant funnel analytics
   - Time-to-fill reporting
   - Source effectiveness tracking
   - Custom report generation

7. **Messaging System**:
   - In-app messaging between employers and candidates
   - Message threading and organization
   - Notification system for new messages
   - Message templates for common communications

## Folder Structure

```
Jobs_API/
├── src/
│   ├── config/             # Configuration management
│   ├── controllers/        # Request handlers
│   ├── db/                 # Database connection
│   ├── errors/             # Custom error classes
│   ├── interfaces/         # TypeScript interfaces
│   ├── middleware/         # Express middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API route definitions
│   ├── services/           # Business logic services
│   │   ├── elasticsearch/  # Elasticsearch service
│   │   ├── analytics/      # Analytics service
│   │   ├── messaging/      # Messaging service
│   │   └── resume/         # Resume parsing service
│   ├── utils/              # Utility functions
│   ├── app.ts              # Express application setup
│   └── server.ts           # Application entry point
├── tests/                  # Test files
├── swagger.yaml            # API documentation
├── .env                    # Environment variables
├── tsconfig.json           # TypeScript configuration
└── package.json            # Project dependencies
```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST   | /api/v1/auth/register | Register new user | None |
| POST   | /api/v1/auth/login | Authenticate user | None |
| POST   | /api/v1/auth/verify-email | Verify email address | None |
| GET    | /api/v1/auth/me | Get current user profile | JWT Required |

### Jobs

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST   | /api/v1/jobs | Create new job | JWT Required |
| GET    | /api/v1/jobs | Get all jobs | None |
| GET    | /api/v1/jobs/:id | Get single job | None |
| PATCH  | /api/v1/jobs/:id | Update job | JWT Required |
| DELETE | /api/v1/jobs/:id | Delete job | JWT Required |
| GET    | /api/v1/jobs/search | Search jobs | None |
| GET    | /api/v1/jobs/recommendations | Get job recommendations | JWT Required |

### Companies

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST   | /api/v1/companies | Create new company | JWT Required |
| GET    | /api/v1/companies | Get all companies | None |
| GET    | /api/v1/companies/:id | Get single company | None |
| PATCH  | /api/v1/companies/:id | Update company | JWT Required |
| DELETE | /api/v1/companies/:id | Delete company | JWT Required |
| POST   | /api/v1/companies/:id/reviews | Add company review | JWT Required |
| GET    | /api/v1/companies/:id/jobs | Get company jobs | None |
| POST   | /api/v1/companies/:id/team | Add team member | JWT Required |
| DELETE | /api/v1/companies/:id/team/:userId | Remove team member | JWT Required |

### Applicants

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST   | /api/v1/applicants/profile | Create applicant profile | JWT Required |
| GET    | /api/v1/applicants/profile | Get own profile | JWT Required |
| PATCH  | /api/v1/applicants/profile | Update profile | JWT Required |
| POST   | /api/v1/applicants/resume | Upload resume | JWT Required |
| POST   | /api/v1/applicants/apply/:jobId | Apply for job | JWT Required |
| GET    | /api/v1/applicants/applications | Get own applications | JWT Required |
| GET    | /api/v1/applicants/applications/:id | Get application details | JWT Required |

### Application Management (Employer)

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| GET    | /api/v1/applications/job/:jobId | Get applications for job | JWT Required |
| PATCH  | /api/v1/applications/:id/status | Update application status | JWT Required |
| POST   | /api/v1/applications/:id/feedback | Add feedback to application | JWT Required |
| POST   | /api/v1/applications/:id/interview | Schedule interview | JWT Required |
| GET    | /api/v1/applications/:id/resume | Download applicant resume | JWT Required |

### Analytics

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| GET    | /api/v1/analytics/jobs | Get job performance metrics | JWT Required |
| GET    | /api/v1/analytics/applications | Get application funnel analytics | JWT Required |
| GET    | /api/v1/analytics/company | Get company analytics | JWT Required |
| GET    | /api/v1/analytics/reports | Generate custom reports | JWT Required |

### Messaging

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST   | /api/v1/messages | Send a message | JWT Required |
| GET    | /api/v1/messages | Get all conversations | JWT Required |
| GET    | /api/v1/messages/:conversationId | Get conversation messages | JWT Required |
| PATCH  | /api/v1/messages/:messageId/read | Mark message as read | JWT Required |
| DELETE | /api/v1/messages/:messageId | Delete a message | JWT Required |

### Search

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| GET    | /api/v1/search/jobs | Advanced job search | None |
| GET    | /api/v1/search/companies | Search companies | None |
| POST   | /api/v1/search/save | Save a search | JWT Required |
| GET    | /api/v1/search/saved | Get saved searches | JWT Required |
| DELETE | /api/v1/search/saved/:id | Delete saved search | JWT Required |

## Data Models

### User

- Basic user information (name, email, password)
- Role-based access control (user, employer, admin)
- Email verification
- Account security features

### Job

- Rich job details (title, description, requirements)
- Location information (city, country, remote options)
- Salary range and benefits
- Application questions and deadline
- Categories and tags
- Application statistics

### Company

- Company profile (name, description, industry)
- Multiple locations
- Team members with different roles
- Reviews and ratings
- Social media links
- Verification status

### Applicant

- Professional profile (education, experience, skills)
- Resume/CV storage and parsed data
- Job preferences
- Application tracking
- Interview availability

### Application

- Reference to job and applicant
- Application status tracking
- Resume/CV version submitted
- Answers to application questions
- Interview scheduling
- Feedback and evaluation
- Communication history

### Message

- Sender and recipient information
- Message content
- Read status
- Timestamp
- Conversation grouping
- Attachments

## Advanced Features

### Elasticsearch Integration

The Jobs API integrates with Elasticsearch to provide powerful search capabilities:

- Full-text search across jobs, companies, and applicants
- Fuzzy matching for typo tolerance
- Boosting relevant fields
- Faceted search for filtering
- Geospatial search for location-based queries
- Autocomplete suggestions
- Search analytics

### Applicant Tracking System

A comprehensive system for managing job applications:

- Application pipeline with customizable stages
- Status tracking (applied, screening, interview, offer, etc.)
- Resume parsing and data extraction
- Candidate evaluation forms
- Interview scheduling
- Automated email communications
- Applicant comparison tools

### Analytics Dashboard

Detailed analytics for employers and administrators:

- Job performance metrics (views, applications, conversion rates)
- Applicant funnel visualization
- Time-to-fill reporting
- Source effectiveness tracking
- Candidate quality metrics
- Market trends analysis
- Custom report generation

### Messaging System

In-app communication between employers and candidates:

- Threaded conversations
- Message templates
- Read receipts
- File attachments
- Notification system
- Message search and filtering
- Conversation organization

## Security Features

- JWT authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting
- XSS protection
- MongoDB query sanitization
- CORS protection
- Helmet for HTTP security headers
- Role-based access control
- API key authentication for partners

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/jobs-api
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=30d
   ELASTICSEARCH_NODE=http://localhost:9200
   ELASTICSEARCH_USERNAME=elastic
   ELASTICSEARCH_PASSWORD=your_password
   EMAIL_SERVICE=gmail
   EMAIL_USERNAME=your_email@gmail.com
   EMAIL_PASSWORD=your_email_password
   FRONTEND_URL=http://localhost:3000
   ```
4. Start Elasticsearch (required for search functionality):
   ```
   docker run -d --name elasticsearch -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" elasticsearch:7.14.0
   ```
5. Start the development server:
   ```
   npm run dev
   ```
6. Access the API at `http://localhost:5000/api/v1`
7. View API documentation at `http://localhost:5000/api-docs`

## Testing

Run tests with:
```
npm test
```

## Dependencies

- express: Web framework
- mongoose: MongoDB ODM
- typescript: JavaScript with syntax for types
- jsonwebtoken: JWT implementation
- bcryptjs: Password hashing
- express-async-errors: Async error handling
- http-status-codes: HTTP status code constants
- helmet: HTTP security headers
- xss-clean: XSS protection
- express-rate-limit: Rate limiting
- swagger-ui-express: API documentation
- winston: Logging library
- elasticsearch: Elasticsearch client
- multer: File upload handling
- pdf-parse: PDF parsing for resumes
- socket.io: Real-time communication
- nodemailer: Email sending
- bull: Job queue for background processing