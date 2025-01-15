import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

type Env = ReturnType<typeof createEnv>;
export const keys = (): Env =>
  createEnv({
    client: {
      NEXT_PUBLIC_AXIOM_TOKEN: z.string().min(1).optional(),
      NEXT_PUBLIC_AXIOM_DATASET: z.string().min(1).optional(),
    },
    server: {
      // Added by Sentry Integration, Vercel Marketplace
      SENTRY_ORG: z.string().min(1).optional(),
      SENTRY_PROJECT: z.string().min(1).optional(),
    },
    runtimeEnv: {
      NEXT_PUBLIC_AXIOM_TOKEN: process.env.NEXT_PUBLIC_AXIOM_TOKEN,
      NEXT_PUBLIC_AXIOM_DATASET: process.env.NEXT_PUBLIC_AXIOM_DATASET,
      SENTRY_ORG: process.env.SENTRY_ORG,
      SENTRY_PROJECT: process.env.SENTRY_PROJECT,
    },
  });
