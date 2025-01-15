import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const keys = () =>
  createEnv({
    server: {
      KV_CONNECT_URL: z.string().min(1).url(),
      KV_ACCESS_TOKEN: z.string().min(1),
    },
    runtimeEnv: {
      KV_CONNECT_URL: process.env.KV_CONNECT_URL,
      KV_ACCESS_TOKEN: process.env.KV_ACCESS_TOKEN,
    },
  });