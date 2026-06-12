import React from 'react';

const MiniBarChart = ({ counts }) => {
  if (!counts || Object.keys(counts).length === 0) return null;

  const entries = Object.entries(counts);
  const maxCount = Math.max(...Object.values(counts), 1);
  const chartHeight = 40;
  const barWidth = 12;
  const gap = 8;
  const totalWidth = entries.length * barWidth + (entries.length - 1) * gap;

  return (
    <div className="mt-4 pt-4 border-t border-border">
      <div className="text-[10px] font-mono-custom text-muted mb-2 uppercase tracking-wider">Object Distribution</div>
      <div className="flex items-end h-[50px] gap-[8px]">
        {entries.map(([className, count], i) => {
          const height = Math.max((count / maxCount) * chartHeight, 2); // min height 2px
          return (
            <div key={className} className="flex flex-col items-center group relative">
              <div 
                className="w-[12px] bg-accent-highlight transition-all duration-200 ease-out"
                style={{ height: `${height}px` }}
              />
              <span className="font-mono-custom text-[9px] text-muted mt-1 w-full text-center truncate">
                {className.substring(0, 3)}
              </span>
              
              {/* Tooltip */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-accent-primary text-white text-[10px] font-mono-custom px-1.5 py-0.5 rounded-[2px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                {className}: {count}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MiniBarChart;
