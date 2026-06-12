import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DropZone from '../components/DropZone';
import ModelSelector from '../components/ModelSelector';
import ConfidenceSlider from '../components/ConfidenceSlider';
import ProgressBar from '../components/ProgressBar';
import useJobPolling from '../hooks/useJobPolling';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [model, setModel] = useState('detection');
  const [confidence, setConfidence] = useState(0.45);
  const [jobId, setJobId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const navigate = useNavigate();
  const { job, isComplete, isFailed } = useJobPolling(jobId);

  useEffect(() => {
    if (isComplete && jobId) {
      // Small delay before redirect to show 100% complete
      const timer = setTimeout(() => {
        navigate(`/dashboard/${jobId}`);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isComplete, jobId, navigate]);

  const handleSubmit = async () => {
    if (!file) return;

    setIsUploading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('model_name', model); // Matches backend expectation
    // formData.append('confidence_threshold', confidence); // Not used by backend currently

    try {
      const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setJobId(response.data.job_id);
    } catch (error) {
      console.error("Upload failed", error);
      setIsUploading(false);
      // Could add error state handling here
    }
  };

  const getStatusText = () => {
    if (!job) return 'Uploading...';
    return job.status; // e.g., 'PROCESSING', 'QUEUED', 'COMPLETE'
  };

  const getProgressValue = () => {
    if (!job) return 0;
    const status = job.status?.toUpperCase();
    if (status === 'COMPLETED' || status === 'COMPLETE') return 100;
    // Fallback logic if backend doesn't provide progress %
    return job.progress || 50; 
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-[680px] mx-auto min-h-[calc(100vh-56px)]">
      <div className="w-full flex flex-col mb-12">
        <h1 className="text-3xl font-medium mb-2">Initialize Inference</h1>
        <p className="text-muted text-[15px]">Upload a media file and configure your model parameters to begin processing.</p>
      </div>

      <DropZone file={file} setFile={setFile} />

      <ModelSelector selectedModel={model} onSelectModel={setModel} />

      <div className="w-full mt-4 bg-surface border border-border p-5">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[14px] font-medium">Confidence Threshold</span>
        </div>
        <ConfidenceSlider value={confidence} onChange={setConfidence} />
      </div>

      <div className="w-full mt-8 h-[48px]">
        {jobId || isUploading ? (
          <ProgressBar progress={getProgressValue()} status={getStatusText()} />
        ) : (
          <button 
            onClick={handleSubmit}
            disabled={!file}
            className={`
              w-full h-full bg-accent-primary text-white font-medium tracking-[0.15em] text-[13px] uppercase rounded-[2px] transition-colors duration-200
              ${file ? 'hover:bg-accent-highlight cursor-pointer' : 'opacity-50 cursor-not-allowed'}
            `}
          >
            Run Inference
          </button>
        )}
      </div>
    </div>
  );
};

export default UploadPage;
