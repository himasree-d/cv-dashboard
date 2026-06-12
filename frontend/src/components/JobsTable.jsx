import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

const EmptyIllustration = () => (
  <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-muted opacity-50 mb-4">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    <line x1="9" y1="14" x2="15" y2="14" />
  </svg>
);

const JobRow = ({ job, index }) => {
  return (
    <div 
      className="relative grid grid-cols-[100px_minmax(150px,1fr)_120px_100px_120px_80px] gap-4 items-center py-4 px-6 border-b border-border stagger-enter bg-surface transition-colors duration-200 group hover:bg-[#FDFAF6]"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Left Border slide in */}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-accent-highlight transform scale-y-0 group-hover:scale-y-100 origin-center transition-transform duration-200 ease-out" />
      
      <div className="font-mono-custom text-[13px] text-muted truncate" title={job.id}>
        {job.id.split('-')[0]}
      </div>
      
      <div className="text-[14px] text-accent-primary font-medium truncate">
        {job.filename}
      </div>
      
      <div className="text-[13px] text-muted">
        {job.model}
      </div>
      
      <div>
        <StatusBadge status={job.status} />
      </div>
      
      <div className="text-[13px] text-muted">
        {new Date(job.created_at || Date.now()).toLocaleDateString()}
      </div>
      
      <div className="flex justify-end">
        <Link 
          to={`/dashboard/${job.id}`} 
          className="text-[13px] font-medium text-accent-primary group/link flex items-center"
        >
          Open
          <span className="ml-1 inline-block transform transition-transform duration-200 group-hover/link:translate-x-1">
            →
          </span>
        </Link>
      </div>
    </div>
  );
};

const JobsTable = ({ jobs }) => {
  if (!jobs || jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <EmptyIllustration />
        <p className="text-muted text-[15px]">No jobs yet. Upload a file to get started.</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col border border-border bg-surface">
      <div className="grid grid-cols-[100px_minmax(150px,1fr)_120px_100px_120px_80px] gap-4 px-6 py-3 border-b border-border bg-[#FDFDFC] text-[12px] font-medium text-muted uppercase tracking-wider">
        <div>Job ID</div>
        <div>File</div>
        <div>Model</div>
        <div>Status</div>
        <div>Created</div>
        <div className="text-right">Action</div>
      </div>
      <div className="flex flex-col">
        {jobs.map((job, idx) => (
          <JobRow key={job.id} job={job} index={idx} />
        ))}
      </div>
    </div>
  );
};

export default JobsTable;
