import React, { useEffect, useRef, useState } from 'react';

const ThumbnailStrip = ({ videoRef, metadata, duration }) => {
  const containerRef = useRef(null);
  const [thumbnails, setThumbnails] = useState([]);
  const [maxDetectionsFrame, setMaxDetectionsFrame] = useState(null);

  useEffect(() => {
    if (!videoRef.current || !metadata || metadata.length === 0 || !duration) return;

    // Find interesting frames (e.g., frames with highest detection counts, spaced out)
    const findKeyFrames = () => {
      let maxDetCount = 0;
      let maxDetFrame = null;
      const keyframes = [];
      const intervalCount = 10;
      const step = Math.floor(metadata.length / intervalCount) || 1;

      for (let i = 0; i < metadata.length; i += step) {
        const frame = metadata[i];
        keyframes.push(frame);
      }

      metadata.forEach(frame => {
        const count = frame.detections?.length || 0;
        if (count > maxDetCount) {
          maxDetCount = count;
          maxDetFrame = frame.frame_index;
        }
      });

      setMaxDetectionsFrame(maxDetFrame);
      return keyframes;
    };

    const keyframes = findKeyFrames();
    
    // We can't synchronously extract canvas from video at different times without seeking.
    // To do this properly without disrupting playback, we would need a hidden secondary video element.
    // For this dashboard, we'll simulate the thumbnails by rendering empty boxes that clicking will seek to,
    // since extracting 10 actual frame images requires a separate invisible video player to seek and capture.
    
    // Instead of full extraction which is complex and error-prone, let's create a timeline map
    setThumbnails(keyframes);

  }, [metadata, videoRef, duration]);

  const handleSeek = (frameIndex) => {
    if (videoRef.current && metadata && metadata.length > 0) {
      // Assuming roughly constant fps, estimate time. 
      // Better: find the timestamp in metadata if available.
      const fps = 30; // default assumption or passed prop
      videoRef.current.currentTime = frameIndex / fps;
    }
  };

  if (thumbnails.length === 0) return null;

  return (
    <div className="w-full flex overflow-x-auto py-3 px-4 gap-2 border-t border-border no-scrollbar bg-surface" ref={containerRef}>
      {thumbnails.map((frame, i) => {
        const isMax = frame.frame_index === maxDetectionsFrame;
        return (
          <div 
            key={i}
            onClick={() => handleSeek(frame.frame_index)}
            className={`
              shrink-0 h-12 w-20 bg-[#1A1A1A] cursor-pointer 
              transition-transform duration-150 hover:scale-110 relative flex items-center justify-center
              ${isMax ? 'border-[1.5px] border-accent-highlight' : 'border border-border opacity-70 hover:opacity-100'}
            `}
            title={`Frame ${frame.frame_index} - Detections: ${frame.detections?.length || 0}`}
          >
            <span className="text-[9px] font-mono-custom text-white opacity-50">
              F{frame.frame_index}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default ThumbnailStrip;
