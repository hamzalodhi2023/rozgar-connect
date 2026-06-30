import { GoogleGenAI } from '@google/genai';
import { env } from '../config/env.js';

let aiInstance: GoogleGenAI | null = null;

const getAIInstance = (): GoogleGenAI => {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in the environment variables.');
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
};

export const getGeminiReply = async (userMessage: string, systemInstruction: string): Promise<string> => {
  try {
    const ai = getAIInstance();
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userMessage,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.1, // Low temperature for high factual accuracy relative to context
      }
    });

    if (!response || !response.text) {
      throw new Error('Received empty response from Gemini API');
    }

    return response.text;
  } catch (error: any) {
    console.error('[GeminiService] Error calling Google Gemini API:', error.message);
    throw error; // Re-throw to let the controller handle it gracefully
  }
};
