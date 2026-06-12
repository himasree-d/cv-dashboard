import React from 'react';
import { getClassColor } from '../utils/frameUtils';

const DetectionItem = ({ detection, isHighest }) => {
  const dotColor = getClassColor(detection.class_id);

  return (
    <div className={`flex flex-col py-2 border-b border-border border-opacity-50 last:border-0 ${isHighest ? 'bg-[#FDFAF6] -mx-2 px-2' : ''}`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div 
            className="w-2 h-2 rounded-full mr-2" 
            style={{ backgroundColor: dotColor }} 
          />
          <span className={`text-accent-primary ${isHighest ? 'font-medium text-[14px]' : 'text-[13px]'}`}>
            {detection.class_name}
          </span>
        </div>
        <span className="font-mono-custom text-[13px] text-muted">
          {detection.confidence.toFixed(2)}
        </span>
      </div>
      
      {detection.bbox && detection.bbox.length === 4 && (
        <div className="font-mono-custom text-[10px] text-muted ml-4 mt-[2px] opacity-70">
          [{Math.round(detection.bbox[0])}, {Math.round(detection.bbox[1])}] → [{Math.round(detection.bbox[2])}, {Math.round(detection.bbox[3])}]
        </div>
      )}
    </div>
  );
};

const DetectionList = ({ detections, highestDetection }) => {
  if (!detections || detections.length === 0) {
    return <div className="text-[13px] text-muted py-4">No detections in this frame.</div>;
  }

  return (
    <div className="flex flex-col w-full">
      {detections.map((det, idx) => (
        <DetectionItem 
          key={idx} 
          detection={det} 
          isHighest={highestDetection && det === highestDetection} 
        />
      ))}
    </div>
  );
};

export default DetectionList;
