import { getKnowledge } from './knowledge.service.js';

interface KeywordMapping {
  [fileName: string]: string[];
}

const keywordMappings: KeywordMapping = {
  'authentication.json': ['login', 'logout', 'auth', 'password', 'token', 'jwt', 'cookie', 'session', 'intercept', 'forgot', 'reset'],
  'registration.json': ['register', 'signup', 'role', 'customer', 'worker', 'join', 'name', 'email'],
  'customer.json': ['customer', 'search', 'hire', 'find', 'chat', 'review', 'rating', 'switch'],
  'worker.json': ['worker', 'setup', 'update', 'verify', 'verification', 'id card', 'upload', 'dashboard'],
  'worker-profile.json': ['profile', 'category', 'city', 'area', 'phone', 'whatsapp', 'photo', 'rating', 'reviews'],
  'search.json': ['search', 'find', 'category', 'city', 'area', 'sort', 'active'],
  'filters.json': ['filter', 'sort', 'reset', 'advanced', 'city', 'area'],
  'chat.json': ['chat', 'message', 'socket', 'typing', 'online', 'conversation'],
  'ratings.json': ['rating', 'stars', 'average', 'score'],
  'reviews.json': ['review', 'comment', 'feedback', 'write'],
  'admin.json': ['admin', 'stats', 'deactivate', 'categories', 'moderate', 'user management']
};

export const buildPromptContext = (userMessage: string): { systemInstruction: string; contextText: string } => {
  const query = userMessage.toLowerCase();
  const allKnowledge = getKnowledge();
  const selectedFiles = new Set<string>();

  // Always include faq.json as a core baseline context
  selectedFiles.add('faq.json');

  // Compute keyword matches for other files
  for (const [fileName, keywords] of Object.entries(keywordMappings)) {
    const hasMatch = keywords.some(keyword => query.includes(keyword));
    if (hasMatch) {
      selectedFiles.add(fileName);
    }
  }

  // Retrieve contents of selected files and format them for the AI context
  let contextText = '### ROZGAR CONNECT KNOWLEDGE BASE CONTEXT ###\n\n';
  selectedFiles.forEach(fileName => {
    const content = allKnowledge[fileName];
    if (content) {
      contextText += `--- START OF DOCUMENT: ${fileName} ---\n`;
      contextText += JSON.stringify(content, null, 2);
      contextText += `\n--- END OF DOCUMENT: ${fileName} ---\n\n`;
    }
  });

  const systemInstruction = `You are Rozgar AI.
You are the official assistant of Rozgar Connect.
You are allowed to engage in polite and friendly chit-chat and respond to greetings (like "hello", "hi", "hey", "salam", "how are you", etc.).
If anyone asks who created you, who made you, or who developed you, you must proudly state that you were created by **Hamza Khan Lodhi**. You must also provide his GitHub link (https://github.com/hamzalodhi2023) and his portfolio link (https://hamza-khan-lodhi.netlify.app/).
However, for any specific tasks, features, or questions, you must only answer questions related to Rozgar Connect.
Use only the provided Knowledge Base.
Never invent features.
If the answer does not exist inside the Knowledge Base, politely reply:
'I couldn't find information about that feature yet.'
If the user asks anything unrelated to Rozgar Connect (other than casual greetings or creator inquiries), politely respond:
'I can only help you with Rozgar Connect.'

Use the following Context to answer user questions:
${contextText}`;

  return { systemInstruction, contextText };
};
