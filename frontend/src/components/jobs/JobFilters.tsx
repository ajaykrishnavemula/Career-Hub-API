import React from 'react';
import { Input, Select, Button } from '@/components/ui';

interface JobFiltersProps {
  filters: {
    search: string;
    location: string;
    type: string;
    experience: string;
    remote: string;
  };
  onFilterChange: (filters: any) => void;
  onReset: () => void;
}

export const JobFilters: React.FC<JobFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
}) => {
  const handleChange = (field: string, value: string) => {
    onFilterChange({ ...filters, [field]: value });
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
        >
          Reset
        </Button>
      </div>
      
      <Input
        placeholder="Search jobs..."
        value={filters.search}
        onChange={(e) => handleChange('search', e.target.value)}
        icon={
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        }
      />
      
      <Input
        placeholder="Location"
        value={filters.location}
        onChange={(e) => handleChange('location', e.target.value)}
        icon={
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
        }
      />
      
      <Select
        label="Job Type"
        value={filters.type}
        onChange={(value) => handleChange('type', value)}
        options={[
          { value: '', label: 'All Types' },
          { value: 'full-time', label: 'Full Time' },
          { value: 'part-time', label: 'Part Time' },
          { value: 'contract', label: 'Contract' },
          { value: 'internship', label: 'Internship' },
        ]}
      />
      
      <Select
        label="Experience Level"
        value={filters.experience}
        onChange={(value) => handleChange('experience', value)}
        options={[
          { value: '', label: 'All Levels' },
          { value: 'entry', label: 'Entry Level' },
          { value: 'mid', label: 'Mid Level' },
          { value: 'senior', label: 'Senior Level' },
          { value: 'lead', label: 'Lead' },
        ]}
      />
      
      <Select
        label="Remote"
        value={filters.remote}
        onChange={(value) => handleChange('remote', value)}
        options={[
          { value: '', label: 'All' },
          { value: 'true', label: 'Remote Only' },
          { value: 'false', label: 'On-site Only' },
        ]}
      />
    </div>
  );
};

