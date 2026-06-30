import axiosInstance from './axios.service.js';

export const getCategories = async () => {
  const response = await axiosInstance.get('/categories');
  return response.data;
};

export const adminCreateCategory = async (data: { name: string; label: string; iconName: string; iconColor: string }) => {
  const response = await axiosInstance.post('/admin/categories', data);
  return response.data;
};

export const adminUpdateCategory = async (id: string, data: { name?: string; label?: string; iconName?: string; iconColor?: string }) => {
  const response = await axiosInstance.put(`/admin/categories/${id}`, data);
  return response.data;
};

export const adminDeleteCategory = async (id: string) => {
  const response = await axiosInstance.delete(`/admin/categories/${id}`);
  return response.data;
};
