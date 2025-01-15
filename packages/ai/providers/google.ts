import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { keys } from '../keys';

const { GOOGLE_BASE_URL, GOOGLE_API_KEY, GOOGLE_MODEL } = keys();

export const provider = createGoogleGenerativeAI({
  baseURL: GOOGLE_BASE_URL,
  apiKey: GOOGLE_API_KEY,
});

// Model Capabilities should support image input
// More info at https://sdk.vercel.ai/providers/ai-sdk-providers/google-generative-ai#model-capabilities
export const model = provider(GOOGLE_MODEL || 'gemini-1.5-flash-latest');
