import { Request, Response, NextFunction } from 'express';
import { buildPromptContext } from '../services/prompt.service.js';
import { getGeminiReply } from '../services/gemini.service.js';
import { sendSuccess, sendError } from '../utils/response.utils.js';

export const chatWithAI = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return sendError(res, 'A valid message string is required', 400);
    }

    // 1. Build Custom Context and System Instructions based on user query
    const sanitizedMessage = message.trim();
    const { systemInstruction } = buildPromptContext(sanitizedMessage);

    // 2. Call Gemini
    const aiReply = await getGeminiReply(sanitizedMessage, systemInstruction);

    // 3. Return response in requested format: { reply: "..." }
    return res.status(200).json({
      reply: aiReply.trim()
    });
  } catch (error: any) {
    console.error('[AIController] Error handling AI Chat request:', error.message);
    
    // Return standard user-facing error message instead of stack trace
    return res.status(500).json({
      reply: 'Sorry, Rozgar AI is currently unavailable. Please try again later.'
    });
  }
};
