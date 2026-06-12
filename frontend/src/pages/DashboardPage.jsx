import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import VideoPlayer from '../components/VideoPlayer';
import MetadataSidebar from '../components/MetadataSidebar';
import useFrameSync from '../hooks/useFrameSync';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const DashboardPage = () => {
  const { jobId } = useParams();
  const [videoUrl, setVideoUrl] = useState(null);
  const [mediaType, setMediaType] = useState('video'); // 'video' or 'image'
  const [metadata, setMetadata] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // 1. Fetch job details to check if it's a video or image
        const jobRes = await axios.get(`${API_BASE_URL}/jobs/${jobId}`);
        const filename = jobRes.data.filename.toLowerCase();
        const isVideo = filename.endsWith('.mp4') || filename.endsWith('.avi') || filename.endsWith('.mov');

        // 2. Fetch metadata
        const metaRes = await axios.get(`${API_BASE_URL}/jobs/${jobId}/metadata`);
        setMetadata(metaRes.data.frames || metaRes.data || []);

        // 3. Set the media URL and type correctly
        if (isVideo) {
          setMediaType('video');
          setVideoUrl(`${API_BASE_URL}/jobs/${jobId}/video`);
        } else {
          setMediaType('image');
          setVideoUrl(`${API_BASE_URL}/jobs/${jobId}/result`);
        }

      } catch (err) {
        console.error("Failed to load dashboard data", err);
        setError("Failed to load processing results. The job may not be complete or might have failed.");
      } finally {
        setIsLoading(false);
      }
    };

    if (jobId) {
      fetchDashboardData();
    }
  }, [jobId]);

  // Use the frame sync hook to coordinate video time and metadata
  // Get fps from first frame or default to 30
  const fps = metadata[0]?.fps || 30;
  const { currentFrameIndex, currentFrameData } = useFrameSync(videoRef, metadata, fps);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#0D0D0D]">
        <div className="w-16 h-16 border-2 border-border border-t-accent-highlight rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-status-failed mb-4">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <h2 className="text-xl font-medium mb-2">Error Loading Results</h2>
        <p className="text-muted">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex overflow-hidden h-[calc(100vh-56px)]">
      {/* Video Area (Left) */}
      <VideoPlayer 
        videoRef={videoRef}
        videoUrl={videoUrl}
        mediaType={mediaType}
        metadata={metadata}
        currentFrameIndex={currentFrameIndex}
      />

      {/* Metadata Sidebar (Right) */}
      <MetadataSidebar frameData={currentFrameData} />
    </div>
  );
};

export default DashboardPage;
