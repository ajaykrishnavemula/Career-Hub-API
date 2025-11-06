import React from 'react';
import type { Application } from '@/types';
import { Card, CardContent, Badge, Button } from '@/components/ui';
import { useNavigate } from 'react-router-dom';

interface ApplicationCardProps {
  application: Application;
  onWithdraw?: (applicationId: string) => void;
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  onWithdraw,
}) => {
  const navigate = useNavigate();
  
  const getStatusColor = (status: string): 'default' | 'success' | 'warning' | 'danger' | 'info' => {
    const colors: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
      pending: 'warning',
      reviewing: 'info',
      shortlisted: 'info',
      accepted: 'success',
      rejected: 'danger',
      withdrawn: 'default',
    };
    return colors[status.toLowerCase()] || 'default';
  };
  
  const handleViewJob = () => {
    const jobId = typeof application.job === 'string' ? application.job : application.job?._id;
    if (jobId) {
      navigate(`/jobs/${jobId}`);
    }
  };
  
  const handleWithdraw = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onWithdraw && application._id) {
      onWithdraw(application._id);
    }
  };
  
  return (
    <Card>
      <CardContent>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {typeof application.job === 'object' ? application.job?.title : 'Job Title'}
            </h3>
            <p className="text-sm text-gray-600">
              {typeof application.job === 'object' ? application.job?.company?.name : 'Company Name'}
            </p>
          </div>
          <Badge variant={getStatusColor(application.status)}>
            {application.status}
          </Badge>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Applied on {new Date(application.appliedDate).toLocaleDateString()}
          </div>
          
          {application.coverLetter && (
            <div className="text-sm text-gray-600">
              <p className="font-medium mb-1">Cover Letter:</p>
              <p className="line-clamp-2">{application.coverLetter}</p>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewJob}
          >
            View Job
          </Button>
          
          {application.status === 'pending' && onWithdraw && (
            <Button
              variant="danger"
              size="sm"
              onClick={handleWithdraw}
            >
              Withdraw
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

