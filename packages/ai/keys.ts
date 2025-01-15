import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = () =>
  createEnv({
    server: {
      AI_PROVIDER: z.enum(['OPENAI', 'GEMINI']),
      OPENAI_API_KEY: z.string().min(1).startsWith('sk-').optional(),
      OPENAI_BASE_URL: z.string().min(1).url().optional(),
      OPENAI_MODEL: z.string().min(1).optional(),
      GOOGLE_API_KEY: z.string().min(1).startsWith('AIza'),
      GOOGLE_BASE_URL: z.string().min(1).url().optional(),
      GOOGLE_MODEL: z.string().min(1).optional(),
    },
    runtimeEnv: {
      AI_PROVIDER: process.env.AI_PROVIDER,
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      OPENAI_MODEL: process.env.OPENAI_MODEL,
      OPENAI_BASE_URL: process.env.OPENAI_BASE_URL,
      GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
      GOOGLE_BASE_URL: process.env.GOOGLE_BASE_URL,
      GOOGLE_MODEL: process.env.GOOGLE_MODEL,
    },
  });
