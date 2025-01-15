import { createOpenAI } from '@ai-sdk/openai';
import { env } from '../keys';

export const provider = createOpenAI({
  apiKey: env().OPENAI_API_KEY,
  baseURL: env().OPENAI_BASE_URL,
  compatibility: 'strict',
});

// Model Capabilities should support image input
// More info at https://sdk.vercel.ai/providers/ai-sdk-providers/openai#model-capabilities
export const model = provider(env().OPENAI_MODEL || 'o1-mini');
