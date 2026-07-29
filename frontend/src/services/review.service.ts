import axiosInstance from './axios.service.js';

export const createReview = async (jobId: any, rating: any, comment: any) => {
  const response = await axiosInstance.post('/reviews', {
    jobId,
    rating,
    comment,
  });
  return response.data;
};

export const getReviewsForWorker = async (workerId) => {
  const response = await axiosInstance.get(`/reviews/worker/${workerId}`);
  return response.data;
};
