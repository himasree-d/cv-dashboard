import useSWR from 'swr';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const fetcher = url => axios.get(url).then(res => res.data);

const useJobPolling = (jobId) => {
  const { data, error, isLoading } = useSWR(
    jobId ? `${API_BASE_URL}/jobs/${jobId}` : null,
    fetcher,
    {
      refreshInterval: (data) => {
        // Stop polling if completed or failed
        const status = data?.status?.toUpperCase();
        if (status === 'COMPLETED' || status === 'COMPLETE' || status === 'FAILED') return 0;
        return 2000;
      },
      revalidateOnFocus: false,
    }
  );

  const status = data?.status?.toUpperCase();

  return {
    job: data,
    isLoading,
    isError: error,
    isComplete: status === 'COMPLETED' || status === 'COMPLETE',
    isFailed: status === 'FAILED',
  };
};

export default useJobPolling;
