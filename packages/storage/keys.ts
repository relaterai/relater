import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const keys = () =>
  createEnv({
    server: {
      STORAGE_ACCESS_KEY_ID: z.string().min(1),
      STORAGE_SECRET_ACCESS_KEY: z.string().min(1),
      STORAGE_ENDPOINT: z.string().min(1).url(),
      STORAGE_REGION: z.string().min(1),
      STORAGE_UPLOAD_BUCKET: z.string().min(1),
    },
    runtimeEnv: {
      STORAGE_ACCESS_KEY_ID: process.env.STORAGE_ACCESS_KEY_ID,
      STORAGE_SECRET_ACCESS_KEY: process.env.STORAGE_SECRET_ACCESS_KEY,
      STORAGE_ENDPOINT: process.env.STORAGE_ENDPOINT,
      STORAGE_REGION: process.env.STORAGE_REGION,
      STORAGE_UPLOAD_BUCKET: process.env.STORAGE_UPLOAD_BUCKET,
    },
  });