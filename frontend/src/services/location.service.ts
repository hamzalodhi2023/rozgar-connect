import axiosInstance from './axios.service.js';

export const getLocations = async (type?: 'city' | 'area') => {
  const url = type ? `/locations?type=${type}` : '/locations';
  const response = await axiosInstance.get(url);
  return response.data;
};

export const createLocation = async (data: { type: 'city' | 'area'; name: string; label: string; cityId?: string }) => {
  const response = await axiosInstance.post('/locations', data);
  return response.data;
};

export const updateLocation = async (id: string, data: { name?: string; label?: string; cityId?: string }) => {
  const response = await axiosInstance.put(`/locations/${id}`, data);
  return response.data;
};

export const deleteLocation = async (id: string) => {
  const response = await axiosInstance.delete(`/locations/${id}`);
  return response.data;
};
