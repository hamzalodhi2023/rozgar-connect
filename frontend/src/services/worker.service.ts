import axiosInstance from './axios.service.js';

export const createWorkerProfile = async (formData) => {
  const response = await axiosInstance.post('/workers', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateWorkerProfile = async (formData) => {
  const response = await axiosInstance.put('/workers', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getMyWorkerProfile = async () => {
  const response = await axiosInstance.get('/workers/me');
  return response.data;
};

export const getWorkerProfileById = async (id) => {
  const response = await axiosInstance.get(`/workers/${id}`);
  return response.data;
};

export const searchWorkers = async (params) => {
  const response = await axiosInstance.get('/workers/search', { params });
  return response.data;
};

export const deleteMyWorkerProfile = async () => {
  const response = await axiosInstance.delete('/workers/me');
  return response.data;
};
