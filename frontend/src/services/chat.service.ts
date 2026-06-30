import axiosInstance from './axios.service.js';

export const getConversations = async () => {
  const response = await axiosInstance.get('/chat/conversations');
  return response.data;
};

export const getMessages = async (conversationId) => {
  const response = await axiosInstance.get(`/chat/messages/${conversationId}`);
  return response.data;
};

export const createConversation = async (recipientId) => {
  const response = await axiosInstance.post('/chat/conversations', { recipientId });
  return response.data;
};
