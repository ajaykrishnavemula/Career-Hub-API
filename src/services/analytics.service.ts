import Job from '../models/Job';
import { ApplicantProfile } from '../models/Applicant';
import Application from '../models/Application';
import Interview from '../models/Interview';
import mongoose from 'mongoose';

/**
 * Analytics Service
 * Provides methods for generating various analytics and reports
 */
class AnalyticsService {
  /**
   * Get job posting analytics
   * @param companyId Optional company ID to filter by
   * @param startDate Optional start date for the analytics period
   * @param endDate Optional end date for the analytics period
   */
  async getJobPostingAnalytics(companyId?: string, startDate?: Date, endDate?: Date) {
    const matchStage: any = {};
    
    if (companyId) {
      matchStage.company = new mongoose.Types.ObjectId(companyId);
    }
    
    if (startDate || endDate) {
      matchStage.createdAt = {};
      if (startDate) matchStage.createdAt.$gte = startDate;
      if (endDate) matchStage.createdAt.$lte = endDate;
    }
    
    const jobAnalytics = await Job.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            jobType: '$jobType',
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' }
          },
          count: { $sum: 1 },
          avgSalary: { $avg: '$salary.max' }
        }
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1
        }
      }
    ]);
    
    const jobTypeDistribution = await Job.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$jobType',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          jobType: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);
    
    const locationDistribution = await Job.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            remote: '$location.remote',
            type: '$location.type'
          },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          locationType: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);
    
    const totalJobs = await Job.countDocuments(matchStage);
    const activeJobs = await Job.countDocuments({ ...matchStage, status: 'active' });
    
    return {
      totalJobs,
      activeJobs,
      jobTypeDistribution,
      locationDistribution,
      jobPostingTrends: jobAnalytics
    };
  }
  
  /**
   * Get application analytics
   * @param companyId Optional company ID to filter by
   * @param startDate Optional start date for the analytics period
   * @param endDate Optional end date for the analytics period
   */
  async getApplicationAnalytics(companyId?: string, startDate?: Date, endDate?: Date) {
    const matchStage: any = {};
    const jobMatchStage: any = {};
    
    if (companyId) {
      jobMatchStage.company = new mongoose.Types.ObjectId(companyId);
    }
    
    if (startDate || endDate) {
      matchStage.createdAt = {};
      if (startDate) matchStage.createdAt.$gte = startDate;
      if (endDate) matchStage.createdAt.$lte = endDate;
    }
    
    // Get job IDs for the company if companyId is provided
    let jobIds: mongoose.Types.ObjectId[] = [];
    if (companyId) {
      const jobs = await Job.find(jobMatchStage).select('_id');
      jobIds = jobs.map(job => job._id);
      matchStage.job = { $in: jobIds };
    }
    
    const applicationTrends = await Application.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            status: '$status',
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1
        }
      }
    ]);
    
    const statusDistribution = await Application.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          status: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);
    
    const jobApplicationDistribution = await Application.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$job',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'jobs',
          localField: '_id',
          foreignField: '_id',
          as: 'jobDetails'
        }
      },
      {
        $unwind: '$jobDetails'
      },
      {
        $project: {
          jobId: '$_id',
          jobTitle: '$jobDetails.position',
          count: 1,
          _id: 0
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);
    
    const totalApplications = await Application.countDocuments(matchStage);
    const pendingApplications = await Application.countDocuments({ ...matchStage, status: 'pending' });
    const interviewedApplications = await Application.countDocuments({ ...matchStage, status: 'interviewing' });
    const hiredApplications = await Application.countDocuments({ ...matchStage, status: 'hired' });
    const rejectedApplications = await Application.countDocuments({ ...matchStage, status: 'rejected' });
    
    return {
      totalApplications,
      pendingApplications,
      interviewedApplications,
      hiredApplications,
      rejectedApplications,
      statusDistribution,
      applicationTrends,
      topJobsByApplications: jobApplicationDistribution
    };
  }
  
  /**
   * Get interview analytics
   * @param companyId Optional company ID to filter by
   * @param startDate Optional start date for the analytics period
   * @param endDate Optional end date for the analytics period
   */
  async getInterviewAnalytics(companyId?: string, startDate?: Date, endDate?: Date) {
    const matchStage: any = {};
    const applicationMatchStage: any = {};
    
    if (startDate || endDate) {
      matchStage.scheduledAt = {};
      if (startDate) matchStage.scheduledAt.$gte = startDate;
      if (endDate) matchStage.scheduledAt.$lte = endDate;
    }
    
    // If companyId is provided, we need to filter interviews for applications to jobs from that company
    if (companyId) {
      // First get jobs for the company
      const jobs = await Job.find({ company: companyId }).select('_id');
      const jobIds = jobs.map(job => job._id);
      
      // Then get applications for those jobs
      const applications = await Application.find({ job: { $in: jobIds } }).select('_id');
      const applicationIds = applications.map((app: mongoose.Document) => app._id);
      
      // Filter interviews by those applications
      matchStage.application = { $in: applicationIds };
    }
    
    const interviewStatusDistribution = await Interview.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          status: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);
    
    const interviewTypeDistribution = await Interview.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          type: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);
    
    const interviewTrends = await Interview.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            status: '$status',
            month: { $month: '$scheduledAt' },
            year: { $year: '$scheduledAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1
        }
      }
    ]);
    
    const totalInterviews = await Interview.countDocuments(matchStage);
    const scheduledInterviews = await Interview.countDocuments({ ...matchStage, status: 'scheduled' });
    const completedInterviews = await Interview.countDocuments({ ...matchStage, status: 'completed' });
    const cancelledInterviews = await Interview.countDocuments({ ...matchStage, status: 'cancelled' });
    
    return {
      totalInterviews,
      scheduledInterviews,
      completedInterviews,
      cancelledInterviews,
      interviewStatusDistribution,
      interviewTypeDistribution,
      interviewTrends
    };
  }
  
  /**
   * Get applicant analytics
   */
  async getApplicantAnalytics() {
    const skillDistribution = await ApplicantProfile.aggregate([
      { $unwind: '$skills' },
      {
        $group: {
          _id: '$skills.name',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          skill: '$_id',
          count: 1,
          _id: 0
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 20
      }
    ]);
    
    const experienceLevelDistribution = await ApplicantProfile.aggregate([
      {
        $addFields: {
          experienceYears: { $size: '$workExperience' }
        }
      },
      {
        $group: {
          _id: {
            $switch: {
              branches: [
                { case: { $lte: ['$experienceYears', 0] }, then: 'No Experience' },
                { case: { $lte: ['$experienceYears', 1] }, then: '0-1 Years' },
                { case: { $lte: ['$experienceYears', 3] }, then: '1-3 Years' },
                { case: { $lte: ['$experienceYears', 5] }, then: '3-5 Years' },
                { case: { $lte: ['$experienceYears', 10] }, then: '5-10 Years' }
              ],
              default: '10+ Years'
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          experienceLevel: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);
    
    const jobTypePreferenceDistribution = await ApplicantProfile.aggregate([
      { $unwind: '$preferredJobTypes' },
      {
        $group: {
          _id: '$preferredJobTypes',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          jobType: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);
    
    const remotePreferenceDistribution = await ApplicantProfile.aggregate([
      {
        $group: {
          _id: '$isRemoteOnly',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          isRemoteOnly: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);
    
    const totalApplicants = await ApplicantProfile.countDocuments();
    
    return {
      totalApplicants,
      skillDistribution,
      experienceLevelDistribution,
      jobTypePreferenceDistribution,
      remotePreferenceDistribution
    };
  }
}

export default new AnalyticsService();

// Made with Bob
