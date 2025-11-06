import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Badge, Loading, Alert, Modal, ModalFooter, Textarea, Card, CardContent } from '@/components/ui';
import { jobService } from '@/services/job.service';
import { applicationService } from '@/services/application.service';
import { useAuthStore } from '@/store';
import type { Job } from '@/types';

export const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [applyModal, setApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyError, setApplyError] = useState('');
  const [applySuccess, setApplySuccess] = useState('');
  
  useEffect(() => {
    if (id) {
      fetchJob();
    }
  }, [id]);
  
  const fetchJob = async () => {
    try {
      setIsLoading(true);
      const response = await jobService.getJobById(id!);
      if (response.success && response.data) {
        setJob(response.data.job);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load job details');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleApply = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setApplyModal(true);
    setCoverLetter('');
    setApplyError('');
    setApplySuccess('');
  };
  
  const handleSubmitApplication = async () => {
    if (!id) return;
    
    setApplyLoading(true);
    setApplyError('');
    
    try {
      await applicationService.createApplication({
        job: id,
        coverLetter,
      });
      
      setApplySuccess('Application submitted successfully!');
      setTimeout(() => {
        setApplyModal(false);
        setCoverLetter('');
        setApplySuccess('');
        navigate('/applications');
      }, 2000);
    } catch (err: any) {
      setApplyError(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setApplyLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading size="lg" text="Loading job details..." />
      </div>
    );
  }
  
  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Alert type="error" message={error || 'Job not found'} />
          <Button onClick={() => navigate('/jobs')} className="mt-4">
            Back to Jobs
          </Button>
        </div>
      </div>
    );
  }
  
  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Salary not disclosed';
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `From $${min.toLocaleString()}`;
    return `Up to $${max?.toLocaleString()}`;
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="outline"
          onClick={() => navigate('/jobs')}
          className="mb-6"
        >
          ← Back to Jobs
        </Button>
        
        <Card>
          <CardContent className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {job.title}
                </h1>
                <p className="text-xl text-gray-600 mb-4">
                  {job.company?.name || 'Company Name'}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="info">{job.type}</Badge>
                  <Badge variant="default">{job.experience}</Badge>
                  {job.remote && <Badge variant="success">Remote</Badge>}
                </div>
              </div>
              {job.company?.logo && (
                <img
                  src={job.company.logo}
                  alt={job.company.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
              )}
            </div>
            
            {/* Key Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="flex items-center text-gray-600 mb-1">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <span className="text-sm font-medium">Location</span>
                </div>
                <p className="text-gray-900">{job.location}</p>
              </div>
              
              <div>
                <div className="flex items-center text-gray-600 mb-1">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium">Salary</span>
                </div>
                <p className="text-gray-900">{formatSalary(job.salary?.min, job.salary?.max)}</p>
              </div>
              
              <div>
                <div className="flex items-center text-gray-600 mb-1">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-medium">Posted</span>
                </div>
                <p className="text-gray-900">{new Date(job.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            
            {/* Description */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Job Description</h2>
              <div className="prose max-w-none text-gray-700 whitespace-pre-line">
                {job.description}
              </div>
            </div>
            
            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Requirements</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {job.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Apply Button */}
            <div className="pt-6 border-t border-gray-200">
              <Button
                size="lg"
                onClick={handleApply}
                fullWidth
              >
                Apply for this Position
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Apply Modal */}
      <Modal
        isOpen={applyModal}
        onClose={() => setApplyModal(false)}
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
                onClick={() => setApplyModal(false)}
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

