import axiosInstance from './axios.service.js';

export const getProfile = async () => {
  const response = await axiosInstance.get('/users/me');
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await axiosInstance.put('/users/me', data);
  return response.data;
};

export const becomeWorker = async () => {
  const response = await axiosInstance.post('/users/become-worker');
  return response.data;
};

export const deleteProfile = async () => {
  const response = await axiosInstance.delete('/users/me');
  return response.data;
};
