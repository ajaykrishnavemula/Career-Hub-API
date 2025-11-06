import React, { useEffect, useState } from 'react';
import { ApplicationCard } from '@/components/jobs';
import { Loading, Alert, Modal, Button } from '@/components/ui';
import { applicationService } from '@/services/application.service';
import type { Application } from '@/types';

export const Applications: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [withdrawModal, setWithdrawModal] = useState<{
    isOpen: boolean;
    applicationId: string | null;
  }>({
    isOpen: false,
    applicationId: null,
  });
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  
  useEffect(() => {
    fetchApplications();
  }, []);
  
  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const response = await applicationService.getMyApplications();
      setApplications(response.data?.items || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load applications');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleWithdrawClick = (applicationId: string) => {
    setWithdrawModal({
      isOpen: true,
      applicationId,
    });
  };
  
  const handleConfirmWithdraw = async () => {
    if (!withdrawModal.applicationId) return;
    
    setWithdrawLoading(true);
    
    try {
      await applicationService.withdrawApplication(withdrawModal.applicationId);
      setApplications(applications.filter(app => app._id !== withdrawModal.applicationId));
      setWithdrawModal({ isOpen: false, applicationId: null });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to withdraw application');
    } finally {
      setWithdrawLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading size="lg" text="Loading applications..." />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Applications
          </h1>
          <p className="text-gray-600">
            Track the status of your job applications
          </p>
        </div>
        
        {error && (
          <Alert
            type="error"
            message={error}
            onClose={() => setError('')}
            className="mb-6"
          />
        )}
        
        {applications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No applications yet
            </h3>
            <p className="text-gray-600 mb-4">
              Start applying to jobs to see your applications here
            </p>
            <Button onClick={() => window.location.href = '/jobs'}>
              Browse Jobs
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => (
              <ApplicationCard
                key={application._id}
                application={application}
                onWithdraw={handleWithdrawClick}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Withdraw Confirmation Modal */}
      <Modal
        isOpen={withdrawModal.isOpen}
        onClose={() => setWithdrawModal({ isOpen: false, applicationId: null })}
        title="Withdraw Application"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to withdraw this application? This action cannot be undone.
          </p>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setWithdrawModal({ isOpen: false, applicationId: null })}
              disabled={withdrawLoading}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmWithdraw}
              isLoading={withdrawLoading}
              disabled={withdrawLoading}
            >
              Withdraw Application
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

