import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const keys = () =>
  createEnv({
    server: {
      AUTH_SECRET: z.string().min(10),
      AUTH_HTTP_ADAPTER_JWT: z.string().min(1).optional(),
    },
    runtimeEnv: {
      AUTH_SECRET: process.env.AUTH_SECRET,
      AUTH_HTTP_ADAPTER_JWT: process.env.AUTH_HTTP_ADAPTER_JWT,
    },
  });
