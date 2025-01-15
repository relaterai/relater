import { createOpenAI } from '@ai-sdk/openai';
import { keys } from '../keys';

const { OPENAI_API_KEY, OPENAI_BASE_URL, OPENAI_MODEL } = keys();

export const provider = createOpenAI({
  apiKey: OPENAI_API_KEY,
  baseURL: OPENAI_BASE_URL,
  compatibility: 'strict',
});

// Model Capabilities should support image input
// More info at https://sdk.vercel.ai/providers/ai-sdk-providers/openai#model-capabilities
export const model = provider(OPENAI_MODEL || 'o1-mini');
