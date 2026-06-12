import React, { useRef, useState, useEffect } from 'react';
import ThumbnailStrip from './ThumbnailStrip';
import { formatTime } from '../utils/formatters';

const PlayIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const PauseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
    <rect x="6" y="4" width="4" height="16" />
    <rect x="14" y="4" width="4" height="16" />
  </svg>
);

const VideoPlayer = ({ videoUrl, mediaType = 'video', metadata, videoRef, currentFrameIndex }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const progressRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [videoRef]);

  const togglePlay = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  };

  const handleSeek = (e) => {
    const val = parseFloat(e.target.value);
    videoRef.current.currentTime = val;
  };

  const handleSpeedChange = (speed) => {
    setPlaybackRate(speed);
    videoRef.current.playbackRate = speed;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex flex-col flex-1 h-full bg-surface relative">
      {/* Media Container */}
      <div className="flex-1 bg-[#0D0D0D] w-full flex items-center justify-center overflow-hidden relative">
        {videoUrl ? (
          mediaType === 'image' ? (
            <img
              src={videoUrl}
              alt="Inference Result"
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <video 
              ref={videoRef}
              src={videoUrl}
              className="w-full h-full object-contain"
              playsInline
            />
          )
        ) : (
          <div className="text-muted text-[14px]">Loading result...</div>
        )}
      </div>

      {/* Custom Controls — only shown for video */}
      {mediaType === 'video' && (
      <div className="flex flex-col bg-[#F7F5F2] border-t border-border w-full">
        <div className="flex items-center px-4 py-3 gap-4">
          <button 
            onClick={togglePlay} 
            className="text-accent-primary hover:text-accent-highlight transition-colors flex-shrink-0 focus:outline-none"
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>

          <div className="flex-1 flex items-center gap-3">
            <span className="font-mono-custom text-[12px] text-accent-primary min-w-[50px] text-right">
              {formatTime(currentTime)}
            </span>
            
            {/* Seek Bar */}
            <div className="flex-1 relative h-6 flex items-center group">
              <div className="absolute w-full h-[2px] bg-border rounded-full transition-all group-hover:h-[3px]" />
              <div 
                className="absolute h-[2px] bg-accent-highlight rounded-full transition-all group-hover:h-[3px]"
                style={{ width: `${progressPercent}%` }}
              />
              <input 
                ref={progressRef}
                type="range" 
                min="0" 
                max={duration || 100} 
                step="0.01" 
                value={currentTime} 
                onChange={handleSeek}
                className="absolute w-full h-full opacity-0 cursor-pointer z-10"
              />
              {/* Custom Thumb */}
              <div 
                className="absolute w-2 h-3 bg-accent-primary transform -translate-x-1/2 pointer-events-none rounded-[1px] opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: `${progressPercent}%` }}
              />
            </div>

            <span className="font-mono-custom text-[12px] text-muted min-w-[50px]">
              {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-4 ml-2">
            {/* Speed Selector */}
            <div className="hidden sm:flex items-center gap-2">
              {[0.5, 1, 1.5, 2].map(speed => (
                <button
                  key={speed}
                  onClick={() => handleSpeedChange(speed)}
                  className={`text-[12px] pb-[1px] border-b-[1.5px] transition-colors ${playbackRate === speed ? 'text-accent-primary border-accent-highlight' : 'text-muted border-transparent hover:text-accent-primary'}`}
                >
                  {speed}x
                </button>
              ))}
            </div>

            {/* Frame Counter */}
            <div className="font-mono-custom text-[11px] text-muted tracking-wider min-w-[70px] text-right">
              Frame {currentFrameIndex}
            </div>
          </div>
        </div>
        
        {/* Thumbnail Strip */}
        <ThumbnailStrip videoRef={videoRef} metadata={metadata} duration={duration} />
      </div>
      )}

      {/* For images: show a simple frame label */}
      {mediaType === 'image' && (
        <div className="bg-[#F7F5F2] border-t border-border px-4 py-3">
          <span className="font-mono-custom text-[12px] text-muted tracking-wider">INFERENCE RESULT — FRAME 0</span>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
