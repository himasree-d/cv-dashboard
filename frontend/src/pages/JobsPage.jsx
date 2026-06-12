import React, { useEffect, useState } from 'react';
import axios from 'axios';
import JobsTable from '../components/JobsTable';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/jobs`);
        // Expected format: array of job objects
        // Or { jobs: [...] } depending on the backend, assume array based on prompt
        const data = response.data.jobs || response.data;
        // Sort by created_at descending if not already
        const sorted = (Array.isArray(data) ? data : []).sort((a, b) => {
          return new Date(b.created_at || 0) - new Date(a.created_at || 0);
        });
        setJobs(sorted);
      } catch (error) {
        console.error("Failed to fetch jobs", error);
        setJobs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center w-full max-w-[1100px] mx-auto p-6 md:p-10">
      <div className="w-full mb-8">
        <h1 className="text-3xl font-medium mb-2">Inference History</h1>
        <p className="text-muted text-[15px]">View and access past computer vision processing jobs.</p>
      </div>

      {isLoading ? (
        <div className="w-full flex flex-col gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="w-full h-16 bg-border opacity-50 animate-[pulse-fast_1.5s_ease-in-out_infinite]" />
          ))}
        </div>
      ) : (
        <JobsTable jobs={jobs} />
      )}
    </div>
  );
};

export default JobsPage;
