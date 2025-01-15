import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const keys = () =>
  createEnv({
    server: {
      ANALYZE: z.string().optional(),
      SENTRY_ORG: z.string().min(1).optional(),
      SENTRY_PROJECT: z.string().min(1).optional(),
    },
    client: {
      NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().min(1).startsWith('G-').optional(),
      NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1).startsWith('phc_'),
      NEXT_PUBLIC_POSTHOG_HOST: z.string().min(1).url(),
    },
    runtimeEnv: {
      ANALYZE: process.env.ANALYZE,
      SENTRY_ORG: process.env.SENTRY_ORG,
      SENTRY_PROJECT: process.env.SENTRY_PROJECT,
      NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
      NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
      NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    },
  });