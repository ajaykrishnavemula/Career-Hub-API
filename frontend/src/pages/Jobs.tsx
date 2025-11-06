import React, { useEffect, useState } from 'react';
import { JobCard, JobFilters } from '@/components/jobs';
import { Loading, Alert } from '@/components/ui';
import { useJobStore } from '@/store';
import { Modal, ModalFooter, Button, Textarea } from '@/components/ui';
import { applicationService } from '@/services/application.service';
import { useAuthStore } from '@/store';
import { useNavigate } from 'react-router-dom';

export const Jobs: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { jobs, isLoading, error, fetchJobs } = useJobStore();
  
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    type: '',
    experience: '',
    remote: '',
  });
  
  const [applyModal, setApplyModal] = useState<{
    isOpen: boolean;
    jobId: string | null;
  }>({
    isOpen: false,
    jobId: null,
  });
  
  const [coverLetter, setCoverLetter] = useState('');
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyError, setApplyError] = useState('');
  const [applySuccess, setApplySuccess] = useState('');
  
  useEffect(() => {
    const jobFilters = {
      search: filters.search || undefined,
      location: filters.location || undefined,
      type: filters.type || undefined,
      experience: filters.experience || undefined,
      remote: filters.remote ? filters.remote === 'true' : undefined,
    };
    fetchJobs(jobFilters);
  }, [filters, fetchJobs]);
  
  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };
  
  const handleResetFilters = () => {
    setFilters({
      search: '',
      location: '',
      type: '',
      experience: '',
      remote: '',
    });
  };
  
  const handleApply = (jobId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setApplyModal({
      isOpen: true,
      jobId,
    });
    setCoverLetter('');
    setApplyError('');
    setApplySuccess('');
  };
  
  const handleSubmitApplication = async () => {
    if (!applyModal.jobId) return;
    
    setApplyLoading(true);
    setApplyError('');
    
    try {
      await applicationService.createApplication({
        job: applyModal.jobId,
        coverLetter,
      });
      
      setApplySuccess('Application submitted successfully!');
      setTimeout(() => {
        setApplyModal({ isOpen: false, jobId: null });
        setCoverLetter('');
        setApplySuccess('');
      }, 2000);
    } catch (err: any) {
      setApplyError(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setApplyLoading(false);
    }
  };
  
  if (isLoading && jobs.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading size="lg" text="Loading jobs..." />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Browse Jobs
          </h1>
          <p className="text-gray-600">
            Find your next opportunity from {jobs.length} available positions
          </p>
        </div>
        
        {error && (
          <Alert
            type="error"
            message={error}
            className="mb-6"
          />
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <JobFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
            />
          </div>
          
          {/* Jobs List */}
          <div className="lg:col-span-3">
            {jobs.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No jobs found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters to see more results
                </p>
                <Button onClick={handleResetFilters}>
                  Reset Filters
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <JobCard
                    key={job._id}
                    job={job}
                    onApply={handleApply}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Apply Modal */}
      <Modal
        isOpen={applyModal.isOpen}
        onClose={() => setApplyModal({ isOpen: false, jobId: null })}
        title="Apply for this position"
        size="lg"
      >
        {applySuccess ? (
          <Alert type="success" message={applySuccess} />
        ) : (
          <>
            {applyError && (
              <Alert
                type="error"
                message={applyError}
                onClose={() => setApplyError('')}
                className="mb-4"
              />
            )}
            
            <div className="space-y-4">
              <p className="text-gray-600">
                Tell the employer why you're a great fit for this role.
              </p>
              
              <Textarea
                label="Cover Letter"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={8}
                placeholder="Write your cover letter here..."
                fullWidth
              />
            </div>
            
            <ModalFooter>
              <Button
                variant="outline"
                onClick={() => setApplyModal({ isOpen: false, jobId: null })}
                disabled={applyLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitApplication}
                isLoading={applyLoading}
                disabled={applyLoading}
              >
                Submit Application
              </Button>
            </ModalFooter>
          </>
        )}
      </Modal>
    </div>
  );
};

