import express from 'express';
import { authenticateUser, authorizeRoles } from '../middleware/auth';
import {
  getJobPostingAnalytics,
  getApplicationAnalytics,
  getInterviewAnalytics,
  getApplicantAnalytics,
  getDashboardAnalytics
} from '../controllers/analytics';

const router = express.Router();

// All analytics routes require authentication
router.use(authenticateUser);

// Dashboard analytics - accessible to admin and employers
router.get('/dashboard', getDashboardAnalytics);

// Job posting analytics - accessible to admin and employers
router.get('/jobs', getJobPostingAnalytics);

// Application analytics - accessible to admin and employers
router.get('/applications', getApplicationAnalytics);

// Interview analytics - accessible to admin and employers
router.get('/interviews', getInterviewAnalytics);

// Applicant analytics - accessible to admin only
router.get('/applicants', authorizeRoles(['admin']), getApplicantAnalytics);

export default router;

// Made with Bob
