# Career-Hub - Complete API Reference

> **Comprehensive API documentation for the Job Portal & Career Management System**

**Base URL**: `http://localhost:5000/api/v1`  
**Version**: 1.0.0  
**Authentication**: JWT Bearer Token

---

## 📋 Table of Contents

- [Authentication](#authentication)
- [Jobs](#jobs)
- [Applications](#applications)
- [Companies](#companies)
- [Applicants](#applicants)
- [Search](#search)
- [Analytics](#analytics)
- [Messaging](#messaging)
- [Error Responses](#error-responses)

---

## 🔐 Authentication

Protected endpoints require JWT token:
```http
Authorization: Bearer <your-jwt-token>
```

---

## 💼 Jobs

### 1. Get All Jobs

Retrieve paginated list of jobs.

**Endpoint**: `GET /jobs`

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `type` (optional): Job type (full-time, part-time, contract, internship)
- `location` (optional): Job location
- `experience` (optional): Experience level (entry, mid, senior)
- `salary` (optional): Salary range
- `remote` (optional): Remote work (true, false)
- `sort` (optional): Sort by (salary, postedDate, applications)

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "jobs": [
      {
        "id": "507f1f77bcf86cd799439011",
        "title": "Senior Backend Developer",
        "company": {
          "id": "507f1f77bcf86cd799439012",
          "name": "Tech Corp",
          "logo": "https://example.com/logo.png"
        },
        "location": "San Francisco, CA",
        "type": "full-time",
        "experience": "senior",
        "salary": {
          "min": 120000,
          "max": 180000,
          "currency": "USD"
        },
        "remote": true,
        "skills": ["Node.js", "MongoDB", "AWS"],
        "applicants": 45,
        "postedDate": "2024-01-15T10:30:00.000Z",
        "deadline": "2024-02-15T23:59:59.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 25,
      "totalItems": 500,
      "itemsPerPage": 20
    }
  }
}
```

---

### 2. Get Job by ID

Get detailed job information.

**Endpoint**: `GET /jobs/:id`

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "job": {
      "id": "507f1f77bcf86cd799439011",
      "title": "Senior Backend Developer",
      "description": "We are looking for an experienced backend developer...",
      "responsibilities": [
        "Design and implement scalable APIs",
        "Optimize database performance",
        "Mentor junior developers"
      ],
      "requirements": [
        "5+ years of Node.js experience",
        "Strong knowledge of MongoDB",
        "Experience with AWS services"
      ],
      "company": {
        "id": "507f1f77bcf86cd799439012",
        "name": "Tech Corp",
        "logo": "https://example.com/logo.png",
        "description": "Leading technology company",
        "website": "https://techcorp.com",
        "size": "1000-5000",
        "industry": "Technology"
      },
      "location": "San Francisco, CA",
      "type": "full-time",
      "experience": "senior",
      "salary": {
        "min": 120000,
        "max": 180000,
        "currency": "USD"
      },
      "benefits": [
        "Health insurance",
        "401(k) matching",
        "Remote work",
        "Unlimited PTO"
      ],
      "remote": true,
      "skills": ["Node.js", "MongoDB", "AWS", "Docker"],
      "applicants": 45,
      "views": 1250,
      "status": "active",
      "postedDate": "2024-01-15T10:30:00.000Z",
      "deadline": "2024-02-15T23:59:59.000Z"
    }
  }
}
```

---

### 3. Create Job (Company)

Post a new job opening.

**Endpoint**: `POST /jobs`

**Headers**:
```http
Authorization: Bearer <company-token>
```

**Request Body**:
```json
{
  "title": "Senior Backend Developer",
  "description": "We are looking for an experienced backend developer...",
  "responsibilities": [
    "Design and implement scalable APIs",
    "Optimize database performance"
  ],
  "requirements": [
    "5+ years of Node.js experience",
    "Strong knowledge of MongoDB"
  ],
  "location": "San Francisco, CA",
  "type": "full-time",
  "experience": "senior",
  "salary": {
    "min": 120000,
    "max": 180000,
    "currency": "USD"
  },
  "benefits": ["Health insurance", "401(k) matching"],
  "remote": true,
  "skills": ["Node.js", "MongoDB", "AWS"],
  "deadline": "2024-02-15T23:59:59.000Z"
}
```

**Success Response** (201 Created):
```json
{
  "success": true,
  "message": "Job posted successfully",
  "data": {
    "job": {
      "id": "507f1f77bcf86cd799439011",
      "title": "Senior Backend Developer",
      "status": "active",
      "postedDate": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

---

### 4. Update Job (Company)

Update job details.

**Endpoint**: `PATCH /jobs/:id`

**Headers**:
```http
Authorization: Bearer <company-token>
```

**Request Body**:
```json
{
  "title": "Senior Backend Developer - Updated",
  "salary": {
    "min": 130000,
    "max": 190000
  },
  "status": "active"
}
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Job updated successfully"
}
```

---

### 5. Delete Job (Company)

Delete a job posting.

**Endpoint**: `DELETE /jobs/:id`

**Headers**:
```http
Authorization: Bearer <company-token>
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Job deleted successfully"
}
```

---

## 📝 Applications

### 1. Get User Applications

Get all applications submitted by user.

**Endpoint**: `GET /applications`

**Headers**:
```http
Authorization: Bearer <token>
```

**Query Parameters**:
- `status` (optional): Filter by status (pending, reviewing, shortlisted, rejected, accepted)
- `page` (optional): Page number
- `limit` (optional): Items per page

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "applications": [
      {
        "id": "507f1f77bcf86cd799439011",
        "job": {
          "id": "507f1f77bcf86cd799439012",
          "title": "Senior Backend Developer",
          "company": "Tech Corp"
        },
        "status": "reviewing",
        "appliedDate": "2024-01-15T10:30:00.000Z",
        "lastUpdated": "2024-01-16T14:20:00.000Z",
        "coverLetter": "I am excited to apply...",
        "resume": "https://example.com/resume.pdf"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 25
    },
    "summary": {
      "total": 25,
      "pending": 5,
      "reviewing": 10,
      "shortlisted": 3,
      "rejected": 5,
      "accepted": 2
    }
  }
}
```

---

### 2. Submit Application

Apply for a job.

**Endpoint**: `POST /jobs/:jobId/apply`

**Headers**:
```http
Authorization: Bearer <token>
```

**Request Body**:
```json
{
  "coverLetter": "I am excited to apply for this position...",
  "resume": "https://example.com/resume.pdf",
  "portfolio": "https://portfolio.com",
  "expectedSalary": 150000,
  "availableFrom": "2024-02-01T00:00:00.000Z",
  "answers": [
    {
      "question": "Why do you want to work here?",
      "answer": "I am passionate about..."
    }
  ]
}
```

**Success Response** (201 Created):
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "data": {
    "application": {
      "id": "507f1f77bcf86cd799439011",
      "jobId": "507f1f77bcf86cd799439012",
      "status": "pending",
      "appliedDate": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

---

### 3. Withdraw Application

Withdraw a submitted application.

**Endpoint**: `DELETE /applications/:id`

**Headers**:
```http
Authorization: Bearer <token>
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Application withdrawn successfully"
}
```

---

### 4. Get Job Applications (Company)

Get all applications for a job.

**Endpoint**: `GET /jobs/:jobId/applications`

**Headers**:
```http
Authorization: Bearer <company-token>
```

**Query Parameters**:
- `status` (optional): Filter by status
- `page` (optional): Page number
- `limit` (optional): Items per page

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "applications": [
      {
        "id": "507f1f77bcf86cd799439011",
        "applicant": {
          "id": "507f1f77bcf86cd799439012",
          "name": "John Doe",
          "email": "john@example.com",
          "phone": "+1234567890"
        },
        "status": "pending",
        "appliedDate": "2024-01-15T10:30:00.000Z",
        "resume": "https://example.com/resume.pdf",
        "coverLetter": "I am excited to apply...",
        "expectedSalary": 150000
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 45
    }
  }
}
```

---

### 5. Update Application Status (Company)

Update application status.

**Endpoint**: `PATCH /applications/:id/status`

**Headers**:
```http
Authorization: Bearer <company-token>
```

**Request Body**:
```json
{
  "status": "shortlisted",
  "notes": "Strong candidate, schedule interview",
  "interviewDate": "2024-01-25T10:00:00.000Z"
}
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Application status updated successfully"
}
```

---

## 🏢 Companies

### 1. Get All Companies

Get list of companies.

**Endpoint**: `GET /companies`

**Query Parameters**:
- `page` (optional): Page number
- `limit` (optional): Items per page
- `industry` (optional): Filter by industry
- `size` (optional): Filter by company size

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "companies": [
      {
        "id": "507f1f77bcf86cd799439011",
        "name": "Tech Corp",
        "logo": "https://example.com/logo.png",
        "industry": "Technology",
        "size": "1000-5000",
        "location": "San Francisco, CA",
        "website": "https://techcorp.com",
        "activeJobs": 15,
        "followers": 2500
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalItems": 200
    }
  }
}
```

---

### 2. Get Company Profile

Get detailed company information.

**Endpoint**: `GET /companies/:id`

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "company": {
      "id": "507f1f77bcf86cd799439011",
      "name": "Tech Corp",
      "logo": "https://example.com/logo.png",
      "description": "Leading technology company...",
      "industry": "Technology",
      "size": "1000-5000",
      "founded": 2010,
      "location": "San Francisco, CA",
      "website": "https://techcorp.com",
      "socialMedia": {
        "linkedin": "https://linkedin.com/company/techcorp",
        "twitter": "https://twitter.com/techcorp"
      },
      "culture": "Innovation-driven, collaborative environment",
      "benefits": [
        "Health insurance",
        "401(k) matching",
        "Remote work"
      ],
      "activeJobs": 15,
      "followers": 2500,
      "rating": 4.5,
      "reviews": 120
    }
  }
}
```

---

### 3. Follow Company

Follow a company for updates.

**Endpoint**: `POST /companies/:id/follow`

**Headers**:
```http
Authorization: Bearer <token>
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Company followed successfully"
}
```

---

### 4. Unfollow Company

Unfollow a company.

**Endpoint**: `DELETE /companies/:id/follow`

**Headers**:
```http
Authorization: Bearer <token>
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Company unfollowed successfully"
}
```

---

## 👤 Applicants

### 1. Get Applicant Profile

Get applicant profile.

**Endpoint**: `GET /applicants/:id`

**Headers**:
```http
Authorization: Bearer <token>
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "applicant": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "location": "San Francisco, CA",
      "title": "Senior Backend Developer",
      "bio": "Experienced backend developer...",
      "experience": [
        {
          "company": "Previous Corp",
          "title": "Backend Developer",
          "startDate": "2020-01-01",
          "endDate": "2023-12-31",
          "description": "Developed scalable APIs..."
        }
      ],
      "education": [
        {
          "institution": "University Name",
          "degree": "Bachelor of Science",
          "field": "Computer Science",
          "graduationYear": 2019
        }
      ],
      "skills": ["Node.js", "MongoDB", "AWS"],
      "resume": "https://example.com/resume.pdf",
      "portfolio": "https://portfolio.com",
      "socialMedia": {
        "linkedin": "https://linkedin.com/in/johndoe",
        "github": "https://github.com/johndoe"
      }
    }
  }
}
```

---

### 2. Update Applicant Profile

Update own profile.

**Endpoint**: `PATCH /applicants/me`

**Headers**:
```http
Authorization: Bearer <token>
```

**Request Body**:
```json
{
  "title": "Senior Backend Developer",
  "bio": "Updated bio...",
  "skills": ["Node.js", "MongoDB", "AWS", "Docker"],
  "location": "San Francisco, CA"
}
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Profile updated successfully"
}
```

---

## 🔍 Search

### 1. Search Jobs

Advanced job search.

**Endpoint**: `GET /search/jobs`

**Query Parameters**:
- `q` (required): Search query
- `location` (optional): Location filter
- `type` (optional): Job type
- `experience` (optional): Experience level
- `salary` (optional): Salary range
- `remote` (optional): Remote work
- `page` (optional): Page number
- `limit` (optional): Items per page

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "id": "507f1f77bcf86cd799439011",
        "title": "Senior Backend Developer",
        "company": "Tech Corp",
        "location": "San Francisco, CA",
        "type": "full-time",
        "salary": {
          "min": 120000,
          "max": 180000
        },
        "relevance": 0.95
      }
    ],
    "totalResults": 150,
    "page": 1,
    "totalPages": 8
  }
}
```

---

## 📊 Analytics

### 1. Get Job Analytics (Company)

Get analytics for posted jobs.

**Endpoint**: `GET /analytics/jobs`

**Headers**:
```http
Authorization: Bearer <company-token>
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalJobs": 25,
      "activeJobs": 15,
      "totalApplications": 450,
      "averageApplicationsPerJob": 30
    },
    "topJobs": [
      {
        "id": "507f1f77bcf86cd799439011",
        "title": "Senior Backend Developer",
        "applications": 45,
        "views": 1250
      }
    ],
    "applicationTrends": [
      {
        "date": "2024-01-15",
        "applications": 25
      }
    ]
  }
}
```

---

## 💬 Messaging

### 1. Get Conversations

Get all conversations.

**Endpoint**: `GET /messages/conversations`

**Headers**:
```http
Authorization: Bearer <token>
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "conversations": [
      {
        "id": "507f1f77bcf86cd799439011",
        "participant": {
          "id": "507f1f77bcf86cd799439012",
          "name": "Tech Corp",
          "avatar": "https://example.com/avatar.png"
        },
        "lastMessage": {
          "content": "Thank you for your application",
          "timestamp": "2024-01-15T10:30:00.000Z"
        },
        "unreadCount": 2
      }
    ]
  }
}
```

---

### 2. Send Message

Send a message.

**Endpoint**: `POST /messages`

**Headers**:
```http
Authorization: Bearer <token>
```

**Request Body**:
```json
{
  "recipientId": "507f1f77bcf86cd799439012",
  "content": "Thank you for considering my application",
  "applicationId": "507f1f77bcf86cd799439013"
}
```

**Success Response** (201 Created):
```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "message": {
      "id": "507f1f77bcf86cd799439011",
      "content": "Thank you for considering my application",
      "timestamp": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

---

## ❌ Error Responses

### Standard Error Format

```json
{
  "success": false,
  "error": "Error Type",
  "message": "Human-readable error message"
}
```

---

## 📊 Status Codes

| Code | Description |
|------|-------------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

---

**Last Updated**: January 2024  
**Version**: 1.0.0  
**Maintainer**: Ajay Krishna (ajaykrishnatech@gmail.com)