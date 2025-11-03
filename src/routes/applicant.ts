import express from 'express';
import {
  createOrUpdateProfile,
  getProfile,
  applyForJob,
  getMyApplications,
  getApplication,
  withdrawApplication,
  getRecommendedJobs,
  getApplicantById,
  updateApplicationStatus,
  scheduleInterview,
  addInterviewFeedback,
  getJobApplications,
  getJobApplicationStats
} from '../controllers/applicant';
import authenticateUser from '../middleware/auth';

const router = express.Router();

// Applicant profile routes
router.post('/profile', authenticateUser, createOrUpdateProfile);
router.get('/profile', authenticateUser, getProfile);

// Job application routes
router.post('/jobs/:jobId/apply', authenticateUser, applyForJob);
router.get('/applications', authenticateUser, getMyApplications);
router.get('/applications/:applicationId', authenticateUser, getApplication);
router.patch('/applications/:applicationId/withdraw', authenticateUser, withdrawApplication);

// Job recommendation routes
router.get('/recommended-jobs', authenticateUser, getRecommendedJobs);

// Employer routes (require authentication)
router.get('/:applicantId', authenticateUser, getApplicantById);
router.patch('/applications/:applicationId/status', authenticateUser, updateApplicationStatus);
router.post('/applications/:applicationId/interviews', authenticateUser, scheduleInterview);
router.post('/applications/:applicationId/interviews/:interviewId/feedback', authenticateUser, addInterviewFeedback);
router.get('/jobs/:jobId/applications', authenticateUser, getJobApplications);
router.get('/jobs/:jobId/stats', authenticateUser, getJobApplicationStats);

export default router;

// Made with Bob
