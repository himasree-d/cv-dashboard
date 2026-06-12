import React from 'react';

const ProgressBar = ({ progress, status }) => {
  return (
    <div className="w-full mt-6">
      <div className="relative w-full h-[3px] bg-border overflow-hidden rounded-full">
        {/* Progress Fill */}
        <div 
          className="absolute top-0 left-0 h-full bg-accent-highlight progress-fill"
          style={{ width: `${progress}%` }}
        />
        {/* Shimmer Effect when processing */}
        {status !== 'COMPLETE' && status !== 'FAILED' && progress > 0 && (
          <div className="shimmer-line" />
        )}
      </div>
      <div className="flex justify-between items-center mt-3">
        <span className="text-[13px] text-muted tracking-wide uppercase">{status}</span>
        <span className="font-mono-custom text-[14px] text-accent-highlight">{progress}%</span>
      </div>
    </div>
  );
};

export default ProgressBar;
