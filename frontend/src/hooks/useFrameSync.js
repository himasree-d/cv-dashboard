import { useState, useEffect, useRef, useCallback } from 'react';

const useFrameSync = (videoRef, metadata, fps = 30) => {
  const [currentFrameData, setCurrentFrameData] = useState(null);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const lastUpdateTime = useRef(0);

  const findClosestFrame = useCallback((frameIndex) => {
    if (!metadata || metadata.length === 0) return null;
    
    // Simple binary search since metadata should be sorted by frame_index
    let left = 0;
    let right = metadata.length - 1;
    let closest = metadata[0];

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const midFrame = metadata[mid].frame_index;

      if (midFrame === frameIndex) {
        return metadata[mid];
      }

      if (Math.abs(midFrame - frameIndex) < Math.abs(closest.frame_index - frameIndex)) {
        closest = metadata[mid];
      }

      if (midFrame < frameIndex) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    return closest;
  }, [metadata]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const now = performance.now();
      // Debounce to max 100ms
      if (now - lastUpdateTime.current < 100) return;
      lastUpdateTime.current = now;

      const currentTime = video.currentTime;
      const calculatedFrameIndex = Math.round(currentTime * fps);
      setCurrentFrameIndex(calculatedFrameIndex);

      const frameData = findClosestFrame(calculatedFrameIndex);
      setCurrentFrameData(frameData);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [videoRef, fps, findClosestFrame]);

  return { currentFrameIndex, currentFrameData };
};

export default useFrameSync;
