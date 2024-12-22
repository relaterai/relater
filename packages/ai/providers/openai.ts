import { createOpenAI, openai } from '@ai-sdk/openai';
import { env } from '@repo/env';

export const openaiProvider = createOpenAI({
  apiKey: env.OPENAI_API_KEY,
  compatibility: 'strict',
});

// Model Capabilities should support image input
// More info at https://sdk.vercel.ai/providers/ai-sdk-providers/openai#model-capabilities
export const model = openai(env.OPENAI_MODEL || 'o1-mini');
