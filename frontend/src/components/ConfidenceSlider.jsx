import React, { useRef, useEffect } from 'react';

const ConfidenceSlider = ({ value, onChange }) => {
  const trackRef = useRef(null);

  useEffect(() => {
    if (trackRef.current) {
      const percentage = (value * 100).toFixed(0);
      trackRef.current.style.setProperty('--value-percent', `${percentage}%`);
    }
  }, [value]);

  return (
    <div className="w-full mt-4 flex items-center justify-between gap-4">
      <div className="flex-1 relative h-6 flex items-center">
        {/* Track Base */}
        <div className="absolute w-full h-[2px] bg-border rounded-full" />
        {/* Track Fill */}
        <div 
          className="absolute h-[2px] bg-accent-highlight rounded-full"
          style={{ width: `${value * 100}%` }}
        />
        {/* Input Overlay */}
        <input 
          ref={trackRef}
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={value} 
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute w-full h-full opacity-0 cursor-pointer z-10"
        />
        {/* Custom Thumb indicator */}
        <div 
          className="absolute w-2 h-4 bg-accent-primary transform -translate-x-1/2 pointer-events-none rounded-[1px]"
          style={{ left: `${value * 100}%` }}
        />
      </div>
      <div className="w-12 text-right">
        <span className="font-mono-custom text-[14px] text-accent-primary">{value.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default ConfidenceSlider;
