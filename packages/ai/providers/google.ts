import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { env } from '../keys';

export const provider = createGoogleGenerativeAI({
  baseURL: env().GOOGLE_BASE_URL,
  apiKey: env().GOOGLE_API_KEY,
});

// Model Capabilities should support image input
// More info at https://sdk.vercel.ai/providers/ai-sdk-providers/google-generative-ai#model-capabilities
export const model = provider(env().GOOGLE_MODEL || 'gemini-1.5-flash-latest');
