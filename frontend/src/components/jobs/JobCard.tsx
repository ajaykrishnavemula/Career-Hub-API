import React from 'react';
import type { Job } from '@/types';
import { Card, CardContent, Badge, Button } from '@/components/ui';
import { useNavigate } from 'react-router-dom';

interface JobCardProps {
  job: Job;
  onApply?: (jobId: string) => void;
  showActions?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  onApply,
  showActions = true,
}) => {
  const navigate = useNavigate();
  
  const handleViewDetails = () => {
    navigate(`/jobs/${job._id}`);
  };
  
  const handleApply = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onApply) {
      onApply(job._id);
    }
  };
  
  const getJobTypeColor = (type: string) => {
    const colors: Record<string, 'default' | 'success' | 'warning' | 'info'> = {
      'full-time': 'success',
      'part-time': 'info',
      'contract': 'warning',
      'internship': 'default',
    };
    return colors[type.toLowerCase()] || 'default';
  };
  
  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Salary not disclosed';
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `From $${min.toLocaleString()}`;
    return `Up to $${max?.toLocaleString()}`;
  };
  
  return (
    <Card hover onClick={handleViewDetails} className="cursor-pointer">
      <CardContent>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {job.title}
            </h3>
            <p className="text-sm text-gray-600">
              {job.company?.name || 'Company Name'}
            </p>
          </div>
          {job.company?.logo && (
            <img
              src={job.company.logo}
              alt={job.company.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant={getJobTypeColor(job.type)}>
            {job.type}
          </Badge>
          <Badge variant="default">
            {job.experience}
          </Badge>
          {job.remote && (
            <Badge variant="info">Remote</Badge>
          )}
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {job.location}
          </div>
          
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formatSalary(job.salary?.min, job.salary?.max)}
          </div>
        </div>
        
        {job.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
            {job.description}
          </p>
        )}
        
        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {job.skills.slice(0, 5).map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 5 && (
              <span className="px-2 py-1 text-xs text-gray-500">
                +{job.skills.length - 5} more
              </span>
            )}
          </div>
        )}
        
        {showActions && (
          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <span className="text-xs text-gray-500">
              Posted {new Date(job.createdAt).toLocaleDateString()}
            </span>
            <Button
              size="sm"
              onClick={handleApply}
            >
              Apply Now
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

