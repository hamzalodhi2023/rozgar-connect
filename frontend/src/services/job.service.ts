import axiosInstance from './axios.service.js';

export const createJob = async (jobData: { workerId: string, description: string }) => {
  const response = await axiosInstance.post('/jobs', jobData);
  return response.data;
};

export const getJobs = async () => {
  const response = await axiosInstance.get('/jobs');
  return response.data;
};

export const updateJobStatus = async (jobId: string, status: string) => {
  const response = await axiosInstance.patch(`/jobs/${jobId}/status`, { status });
  return response.data;
};
