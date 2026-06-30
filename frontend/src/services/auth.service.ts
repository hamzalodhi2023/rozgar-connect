import axiosInstance from './axios.service.js';

export const registerUser = async (name, email, password, role) => {
  const response = await axiosInstance.post('/auth/register', {
    name,
    email,
    password,
    role,
  });
  return response.data;
};

export const loginUser = async (email, password) => {
  const response = await axiosInstance.post('/auth/login', {
    email,
    password,
  });
  return response.data;
};

export const logoutUser = async () => {
  const response = await axiosInstance.post('/auth/logout');
  return response.data;
};

export const refreshUserToken = async () => {
  const response = await axiosInstance.post('/auth/refresh');
  return response.data;
};
