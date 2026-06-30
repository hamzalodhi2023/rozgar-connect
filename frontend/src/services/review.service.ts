import axiosInstance from './axios.service.js';

export const createReview = async (workerId, rating, comment) => {
  const response = await axiosInstance.post('/reviews', {
    workerId,
    rating,
    comment,
  });
  return response.data;
};

export const getReviewsForWorker = async (workerId) => {
  const response = await axiosInstance.get(`/reviews/worker/${workerId}`);
  return response.data;
};
