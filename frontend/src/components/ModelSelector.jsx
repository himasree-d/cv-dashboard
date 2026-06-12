import React, { useRef } from 'react';
import useMouseRepulsion from '../hooks/useMouseRepulsion';

const BoundingBoxIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent-primary mb-2">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18" />
    <path d="M9 21V9" />
  </svg>
);

const PolygonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent-primary mb-2">
    <path d="M12 2l8 6-3 10H7L4 8z" />
    <circle cx="12" cy="2" r="1.5" fill="currentColor" />
    <circle cx="20" cy="8" r="1.5" fill="currentColor" />
    <circle cx="17" cy="18" r="1.5" fill="currentColor" />
    <circle cx="7" cy="18" r="1.5" fill="currentColor" />
    <circle cx="4" cy="8" r="1.5" fill="currentColor" />
  </svg>
);

const SegmentationIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent-primary mb-2">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    <path d="M2 12h20" />
  </svg>
);

const ClassificationIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent-primary mb-2">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
  </svg>
);

const MODELS = [
  { id: 'detection', name: 'YOLOv8 Nano', task: 'Detection', icon: BoundingBoxIcon },
  { id: 'segmentation', name: 'YOLOv8n-Seg', task: 'Segmentation', icon: SegmentationIcon },
];

const ModelCard = ({ model, isSelected, onSelect }) => {
  const cardRef = useRef(null);
  const { offset, handleMouseLeave } = useMouseRepulsion(cardRef, 80, 6);

  const Icon = model.icon;

  return (
    <div 
      ref={cardRef}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelect(model.id)}
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px) ${isSelected ? 'scale(1)' : ''}`,
      }}
      className={`
        relative p-4 bg-surface border cursor-pointer
        flex flex-col items-start w-full
        magnetic-card hover:-translate-y-[2px]
        ${isSelected 
          ? 'border-accent-highlight border-[1.5px] bg-[#FDFAF6]' 
          : 'border-border border-[1px] hover:border-accent-highlight hover:border-opacity-50'}
      `}
    >
      <Icon />
      <span className="text-[14px] font-medium text-accent-primary mt-1">{model.name}</span>
      <span className="text-[12px] text-muted">{model.task}</span>
    </div>
  );
};

const ModelSelector = ({ selectedModel, onSelectModel }) => {
  return (
    <div className="w-full mt-6 mb-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {MODELS.map(model => (
          <ModelCard 
            key={model.id} 
            model={model} 
            isSelected={selectedModel === model.id}
            onSelect={onSelectModel}
          />
        ))}
      </div>
    </div>
  );
};

export default ModelSelector;
