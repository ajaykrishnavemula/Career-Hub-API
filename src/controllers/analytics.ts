import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import analyticsService from '../services/analytics.service';
import asyncWrapper from '../middleware/async';
import { BadRequestError } from '../errors';

/**
 * Get job posting analytics
 * @route GET /api/v1/analytics/jobs
 */
export const getJobPostingAnalytics = asyncWrapper(async (req: Request, res: Response) => {
  const { companyId, startDate, endDate } = req.query;
  
  // Parse dates if provided
  let parsedStartDate: Date | undefined;
  let parsedEndDate: Date | undefined;
  
  if (startDate) {
    parsedStartDate = new Date(startDate as string);
    if (isNaN(parsedStartDate.getTime())) {
      throw new BadRequestError('Invalid start date format');
    }
  }
  
  if (endDate) {
    parsedEndDate = new Date(endDate as string);
    if (isNaN(parsedEndDate.getTime())) {
      throw new BadRequestError('Invalid end date format');
    }
  }
  
  // Check if user is admin or employer
  const userRole = req.user?.role;
  const userId = req.user?.userId;
  
  // If not admin, only allow access to own company data
  if (userRole !== 'admin' && companyId && userId !== companyId) {
    return res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      message: 'Not authorized to access this resource',
    });
  }
  
  const analytics = await analyticsService.getJobPostingAnalytics(
    companyId as string,
    parsedStartDate,
    parsedEndDate
  );
  
  res.status(StatusCodes.OK).json({
    success: true,
    analytics,
  });
});

/**
 * Get application analytics
 * @route GET /api/v1/analytics/applications
 */
export const getApplicationAnalytics = asyncWrapper(async (req: Request, res: Response) => {
  const { companyId, startDate, endDate } = req.query;
  
  // Parse dates if provided
  let parsedStartDate: Date | undefined;
  let parsedEndDate: Date | undefined;
  
  if (startDate) {
    parsedStartDate = new Date(startDate as string);
    if (isNaN(parsedStartDate.getTime())) {
      throw new BadRequestError('Invalid start date format');
    }
  }
  
  if (endDate) {
    parsedEndDate = new Date(endDate as string);
    if (isNaN(parsedEndDate.getTime())) {
      throw new BadRequestError('Invalid end date format');
    }
  }
  
  // Check if user is admin or employer
  const userRole = req.user?.role;
  const userId = req.user?.userId;
  
  // If not admin, only allow access to own company data
  if (userRole !== 'admin' && companyId && userId !== companyId) {
    return res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      message: 'Not authorized to access this resource',
    });
  }
  
  const analytics = await analyticsService.getApplicationAnalytics(
    companyId as string,
    parsedStartDate,
    parsedEndDate
  );
  
  res.status(StatusCodes.OK).json({
    success: true,
    analytics,
  });
});

/**
 * Get interview analytics
 * @route GET /api/v1/analytics/interviews
 */
export const getInterviewAnalytics = asyncWrapper(async (req: Request, res: Response) => {
  const { companyId, startDate, endDate } = req.query;
  
  // Parse dates if provided
  let parsedStartDate: Date | undefined;
  let parsedEndDate: Date | undefined;
  
  if (startDate) {
    parsedStartDate = new Date(startDate as string);
    if (isNaN(parsedStartDate.getTime())) {
      throw new BadRequestError('Invalid start date format');
    }
  }
  
  if (endDate) {
    parsedEndDate = new Date(endDate as string);
    if (isNaN(parsedEndDate.getTime())) {
      throw new BadRequestError('Invalid end date format');
    }
  }
  
  // Check if user is admin or employer
  const userRole = req.user?.role;
  const userId = req.user?.userId;
  
  // If not admin, only allow access to own company data
  if (userRole !== 'admin' && companyId && userId !== companyId) {
    return res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      message: 'Not authorized to access this resource',
    });
  }
  
  const analytics = await analyticsService.getInterviewAnalytics(
    companyId as string,
    parsedStartDate,
    parsedEndDate
  );
  
  res.status(StatusCodes.OK).json({
    success: true,
    analytics,
  });
});

/**
 * Get applicant analytics
 * @route GET /api/v1/analytics/applicants
 */
export const getApplicantAnalytics = asyncWrapper(async (req: Request, res: Response) => {
  // Only admin can access this endpoint
  const userRole = req.user?.role;
  
  if (userRole !== 'admin') {
    return res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      message: 'Not authorized to access this resource',
    });
  }
  
  const analytics = await analyticsService.getApplicantAnalytics();
  
  res.status(StatusCodes.OK).json({
    success: true,
    analytics,
  });
});

/**
 * Get dashboard analytics (summary of all analytics)
 * @route GET /api/v1/analytics/dashboard
 */
export const getDashboardAnalytics = asyncWrapper(async (req: Request, res: Response) => {
  const { companyId } = req.query;
  
  // Check if user is admin or employer
  const userRole = req.user?.role;
  const userId = req.user?.userId;
  
  // If not admin, only allow access to own company data
  if (userRole !== 'admin' && companyId && userId !== companyId) {
    return res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      message: 'Not authorized to access this resource',
    });
  }
  
  // Get all analytics in parallel
  const [jobAnalytics, applicationAnalytics, interviewAnalytics] = await Promise.all([
    analyticsService.getJobPostingAnalytics(companyId as string),
    analyticsService.getApplicationAnalytics(companyId as string),
    analyticsService.getInterviewAnalytics(companyId as string)
  ]);
  
  // If admin, also get applicant analytics
  let applicantAnalytics = null;
  if (userRole === 'admin') {
    applicantAnalytics = await analyticsService.getApplicantAnalytics();
  }
  
  res.status(StatusCodes.OK).json({
    success: true,
    analytics: {
      jobs: jobAnalytics,
      applications: applicationAnalytics,
      interviews: interviewAnalytics,
      applicants: applicantAnalytics,
    },
  });
});

