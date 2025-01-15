import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const keys = () =>
  createEnv({
    server: {
      DATABASE_URL: z.string().min(1).url(),
      DATABASE_DIRECT_URL: z.string().min(1).url(),
    },
    runtimeEnv: {
      DATABASE_URL: process.env.DATABASE_URL,
      DATABASE_DIRECT_URL: process.env.DATABASE_DIRECT_URL,
    },
  });