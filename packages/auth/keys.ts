import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';
import { keys as httpAdapterKeys } from '@repo/auth-js-http-adapter/keys';

export const keys = () =>
  createEnv({
    extends: [httpAdapterKeys()],
    server: {
      AUTH_SECRET: z.string().min(10),
      GOOGLE_CLIENT_ID: z.string().min(1).optional(),
      GOOGLE_CLIENT_SECRET: z.string().min(1).optional(),
    },
    runtimeEnv: {
      AUTH_SECRET: process.env.AUTH_SECRET,
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    },
  });