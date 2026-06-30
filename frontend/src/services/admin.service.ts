import axiosInstance from './axios.service.js';

export const getAdminStats = async () => {
  const response = await axiosInstance.get('/admin/stats');
  return response.data;
};

export const getAllUsers = async () => {
  const response = await axiosInstance.get('/admin/users');
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await axiosInstance.delete(`/admin/users/${id}`);
  return response.data;
};

export const getAllWorkerProfiles = async () => {
  const response = await axiosInstance.get('/admin/workers');
  return response.data;
};

export const deleteWorkerProfile = async (id) => {
  const response = await axiosInstance.delete(`/admin/workers/${id}`);
  return response.data;
};

export const getAllReviews = async () => {
  const response = await axiosInstance.get('/admin/reviews');
  return response.data;
};

export const deleteReview = async (id) => {
  const response = await axiosInstance.delete(`/admin/reviews/${id}`);
  return response.data;
};

export const seedAdmin = async (email) => {
  const response = await axiosInstance.post('/admin/seed', { email });
  return response.data;
};

export const toggleUserStatus = async (id) => {
  const response = await axiosInstance.put(`/admin/users/${id}/toggle-status`);
  return response.data;
};

export const verifyWorker = async (id) => {
  const response = await axiosInstance.put(`/admin/workers/${id}/verify`);
  return response.data;
};

export const rejectWorker = async (id) => {
  const response = await axiosInstance.put(`/admin/workers/${id}/reject`);
  return response.data;
};

export const updateReview = async (id, rating, comment) => {
  const response = await axiosInstance.put(`/admin/reviews/${id}`, { rating, comment });
  return response.data;
};

