import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import elasticsearchService from '../services/elasticsearch.service';
import Job from '../models/Job';
import { ApplicantProfile } from '../models/Applicant';
import asyncWrapper from '../middleware/async';
import { BadRequestError } from '../errors';

/**
 * Advanced job search with Elasticsearch
 * @route GET /api/v1/search/jobs
 */
export const searchJobs = asyncWrapper(async (req: Request, res: Response) => {
  const { query, page = '1', limit = '10', ...filters } = req.query;
  
  // Parse pagination parameters
  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  
  // Validate pagination parameters
  if (isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
    throw new BadRequestError('Invalid pagination parameters');
  }
  
  // Perform search
  const results = await elasticsearchService.searchJobs(
    query as string,
    filters,
    pageNum,
    limitNum
  );
  
  // If Elasticsearch is not available, fall back to MongoDB search
  if (results.total === 0 && !elasticsearchService.isConnected) {
    // Build MongoDB query
    const mongoQuery: any = {};
    
    if (query) {
      mongoQuery.$text = { $search: query as string };
    }
    
    if (filters.jobType) {
      mongoQuery.jobType = filters.jobType;
    }
    
    if (filters.experience) {
      mongoQuery.experience = filters.experience;
    }
    
    if (filters.remote === 'true') {
      mongoQuery['location.remote'] = true;
    }
    
    if (filters.locationType) {
      mongoQuery['location.type'] = filters.locationType;
    }
    
    // Execute MongoDB query
    const jobs = await Job.find(mongoQuery)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);
    
    const total = await Job.countDocuments(mongoQuery);
    
    return res.status(StatusCodes.OK).json({
      success: true,
      count: jobs.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      jobs,
      searchMode: 'mongodb',
    });
  }
  
  res.status(StatusCodes.OK).json({
    success: true,
    count: results.jobs.length,
    total: results.total,
    totalPages: Math.ceil(results.total / limitNum),
    currentPage: pageNum,
    jobs: results.jobs,
    searchMode: 'elasticsearch',
  });
});

/**
 * Advanced applicant search with Elasticsearch
 * @route GET /api/v1/search/applicants
 */
export const searchApplicants = asyncWrapper(async (req: Request, res: Response) => {
  // Check if user is an employer
  const userRole = req.user?.role;
  if (userRole !== 'employer' && userRole !== 'admin') {
    return res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      message: 'Not authorized to access this resource',
    });
  }
  
  const { query, page = '1', limit = '10', ...filters } = req.query;
  
  // Parse pagination parameters
  const pageNum = parseInt(page as string, 10);
  const limitNum = parseInt(limit as string, 10);
  
  // Validate pagination parameters
  if (isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
    throw new BadRequestError('Invalid pagination parameters');
  }
  
  // Perform search
  const results = await elasticsearchService.searchApplicants(
    query as string,
    filters,
    pageNum,
    limitNum
  );
  
  // If Elasticsearch is not available, fall back to MongoDB search
  if (results.total === 0 && !elasticsearchService.isConnected) {
    // Build MongoDB query
    const mongoQuery: any = {};
    
    if (query) {
      mongoQuery.$text = { $search: query as string };
    }
    
    if (filters.skills && Array.isArray(filters.skills)) {
      mongoQuery['skills.name'] = { $in: filters.skills };
    }
    
    if (filters.jobTypes && Array.isArray(filters.jobTypes)) {
      mongoQuery.preferredJobTypes = { $in: filters.jobTypes };
    }
    
    if (filters.remote === 'true') {
      mongoQuery.isRemoteOnly = true;
    }
    
    // Execute MongoDB query
    const applicants = await ApplicantProfile.find(mongoQuery)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);
    
    const total = await ApplicantProfile.countDocuments(mongoQuery);
    
    return res.status(StatusCodes.OK).json({
      success: true,
      count: applicants.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      applicants,
      searchMode: 'mongodb',
    });
  }
  
  res.status(StatusCodes.OK).json({
    success: true,
    count: results.applicants.length,
    total: results.total,
    totalPages: Math.ceil(results.total / limitNum),
    currentPage: pageNum,
    applicants: results.applicants,
    searchMode: 'elasticsearch',
  });
});

/**
 * Get job recommendations for an applicant
 * @route GET /api/v1/search/recommendations/jobs
 */
export const getJobRecommendations = asyncWrapper(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  
  // Get applicant profile
  const applicantProfile = await ApplicantProfile.findOne({ userId });
  
  if (!applicantProfile) {
    return res.status(StatusCodes.OK).json({
      success: true,
      count: 0,
      recommendations: [],
    });
  }
  
  // Get recommendations from Elasticsearch
  const recommendations = await elasticsearchService.getJobRecommendations(applicantProfile);
  
  // If Elasticsearch is not available, fall back to MongoDB
  if (recommendations.length === 0 && !elasticsearchService.isConnected) {
    // Extract skills from profile
    const skills = applicantProfile.skills.map((skill: any) => skill.name);
    
    // Get job titles from work experience
    const jobTitles = applicantProfile.workExperience.map((exp: any) => exp.position);
    
    // Build MongoDB query
    const mongoQuery: any = {
      $or: [
        { 'skills.required': { $in: skills } },
        { 'skills.preferred': { $in: skills } },
      ],
    };
    
    if (jobTitles.length > 0) {
      mongoQuery.$or.push({
        position: { $in: jobTitles.map((title: string) => new RegExp(title, 'i')) },
      });
    }
    
    if (applicantProfile.isRemoteOnly) {
      mongoQuery.isRemote = true;
    }
    
    if (applicantProfile.preferredJobTypes && applicantProfile.preferredJobTypes.length > 0) {
      mongoQuery.jobType = { $in: applicantProfile.preferredJobTypes };
    }
    
    // Execute MongoDB query
    const jobs = await Job.find(mongoQuery)
      .sort({ createdAt: -1 })
      .limit(10);
    
    return res.status(StatusCodes.OK).json({
      success: true,
      count: jobs.length,
      recommendations: jobs,
      searchMode: 'mongodb',
    });
  }
  
  res.status(StatusCodes.OK).json({
    success: true,
    count: recommendations.length,
    recommendations,
    searchMode: 'elasticsearch',
  });
});

/**
 * Get candidate recommendations for a job
 * @route GET /api/v1/search/recommendations/candidates/:jobId
 */
export const getCandidateRecommendations = asyncWrapper(async (req: Request, res: Response) => {
  const { jobId } = req.params;
  const userId = req.user?.userId;
  
  // Check if user is an employer
  const userRole = req.user?.role;
  if (userRole !== 'employer' && userRole !== 'admin') {
    return res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      message: 'Not authorized to access this resource',
    });
  }
  
  // Get job
  const job = await Job.findById(jobId);
  
  if (!job) {
    throw new BadRequestError(`No job found with id ${jobId}`);
  }
  
  // Check if job belongs to employer
  if (userRole !== 'admin' && job.createdBy.toString() !== userId) {
    return res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      message: 'Not authorized to access this resource',
    });
  }
  
  // Get recommendations from Elasticsearch
  const recommendations = await elasticsearchService.getCandidateRecommendations(job);
  
  // If Elasticsearch is not available, fall back to MongoDB
  if (recommendations.length === 0 && !elasticsearchService.isConnected) {
    // Extract requirements from job
    const requirements = job.requirements || [];
    
    // Build MongoDB query
    const mongoQuery: any = {
      $or: [
        { 'skills.name': { $in: requirements } },
        { 'workExperience.position': { $regex: job.position, $options: 'i' } },
      ],
    };
    
    if (job.location.remote === false) {
      mongoQuery.isRemoteOnly = false;
    }
    
    // Execute MongoDB query
    const applicants = await ApplicantProfile.find(mongoQuery)
      .sort({ createdAt: -1 })
      .limit(10);
    
    return res.status(StatusCodes.OK).json({
      success: true,
      count: applicants.length,
      recommendations: applicants,
      searchMode: 'mongodb',
    });
  }
  
  res.status(StatusCodes.OK).json({
    success: true,
    count: recommendations.length,
    recommendations,
    searchMode: 'elasticsearch',
  });
});

