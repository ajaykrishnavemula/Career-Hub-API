import express from 'express';
import { authenticateUser, authorizeRoles } from '../middleware/auth';
import { 
  searchJobs, 
  searchApplicants, 
  getJobRecommendations, 
  getCandidateRecommendations
} from '../controllers/search';

const router = express.Router();

// Public search routes
router.get('/jobs', searchJobs);

// Protected search routes
router.get('/jobs/recommendations', authenticateUser, getJobRecommendations);
router.get('/applicants', authenticateUser, authorizeRoles(['admin', 'employer']), searchApplicants);
router.get('/recommendations/candidates/:jobId', authenticateUser, authorizeRoles(['admin', 'employer']), getCandidateRecommendations);

export default router;

