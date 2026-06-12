import React from 'react';
import { getHighestConfidenceDetection, getObjectCounts } from '../utils/frameUtils';
import DetectionList from './DetectionList';
import MiniBarChart from './MiniBarChart';

const MetadataSidebar = ({ frameData }) => {
  const detections = frameData?.detections || [];
  const highestDetection = getHighestConfidenceDetection(detections);
  const counts = getObjectCounts(detections);
  const countEntries = Object.entries(counts);

  return (
    <div className="w-[320px] shrink-0 border-l border-border bg-surface flex flex-col h-full overflow-y-auto hidden md:flex">
      <div className="p-4 border-b border-border flex justify-between items-center sticky top-0 bg-surface z-10">
        <h2 className="font-mono-custom text-[12px] font-medium tracking-widest uppercase">Frame Analysis</h2>
        <span className="font-mono-custom text-[12px] text-muted">
          #{frameData?.frame_index || 0}
        </span>
      </div>

      <div className="p-4 flex flex-col gap-6">
        {/* Top Object Highlight Card */}
        {highestDetection && (
          <div className="bg-[#FDFAF6] border border-border p-4">
            <div className="text-[11px] text-muted uppercase tracking-wider mb-1">Primary Object</div>
            <div className="text-[20px] font-medium text-accent-primary mb-3">
              {highestDetection.class_name}
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex-1 h-[2px] bg-border relative overflow-hidden rounded-full">
                <div 
                  className="absolute left-0 top-0 h-full bg-accent-highlight transition-all duration-150 ease-out"
                  style={{ width: `${highestDetection.confidence * 100}%` }}
                />
              </div>
              <span className="font-mono-custom text-[12px] text-accent-primary">
                {highestDetection.confidence.toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {/* Inference Details */}
        <div className="flex justify-between items-center text-[12px]">
          <span className="text-muted">Inference Time</span>
          <span className="font-mono-custom text-accent-primary">
            {frameData?.inference_time_ms ? `${frameData.inference_time_ms.toFixed(1)}ms` : '--'}
          </span>
        </div>

        {/* Object Counts Text */}
        {countEntries.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 text-[13px]">
            {countEntries.map(([name, count], i) => (
              <React.Fragment key={name}>
                <span className="text-accent-primary">
                  {name} <span className="font-mono-custom ml-1">{count}</span>
                </span>
                {i < countEntries.length - 1 && <span className="text-border">|</span>}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Bar Chart */}
        <MiniBarChart counts={counts} />

        {/* Detection List */}
        <div className="flex flex-col mt-2">
          <div className="text-[11px] text-muted uppercase tracking-wider mb-2">All Detections</div>
          <DetectionList detections={detections} highestDetection={highestDetection} />
        </div>
      </div>
    </div>
  );
};

export default MetadataSidebar;
