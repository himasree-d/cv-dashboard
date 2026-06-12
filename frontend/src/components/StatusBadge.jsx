import React from 'react';

const StatusBadge = ({ status }) => {
  const getStyles = () => {
    switch (status?.toUpperCase()) {
      case 'COMPLETE':
        return 'border-status-success text-status-success';
      case 'PROCESSING':
      case 'QUEUED':
        return 'border-status-processing text-status-processing';
      case 'FAILED':
        return 'border-status-failed text-status-failed';
      default:
        return 'border-muted text-muted';
    }
  };

  return (
    <div className={`inline-flex items-center px-2 py-[2px] border-[1px] rounded-[2px] font-mono-custom text-[11px] tracking-widest uppercase ${getStyles()}`}>
      {status}
    </div>
  );
};

export default StatusBadge;
