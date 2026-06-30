import axiosInstance from './axios.service.js';

export const sendAIMessage = async (message: string): Promise<string> => {
  try {
    const response = await axiosInstance.post(
      '/ai/chat',
      { message },
      { timeout: 15000 } // 15-second timeout for AI generations
    );

    if (response.data && response.data.reply) {
      return response.data.reply;
    }

    throw new Error('Invalid response structure received from AI service');
  } catch (error: any) {
    console.error('[AIService] Failed to communicate with Rozgar AI:', error.message);
    
    // Check if it's a timeout error
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return 'Sorry, the request timed out. Rozgar AI is currently taking too long to respond. Please try again.';
    }

    // Check if there's a custom backend rate limit / status response message
    if (error.response?.data?.reply) {
      return error.response.data.reply;
    }
    if (error.response?.data?.message) {
      return error.response.data.message;
    }

    return 'Sorry, Rozgar AI is currently unavailable. Please try again later.';
  }
};
