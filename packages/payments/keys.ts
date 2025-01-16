import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const keys = () =>
  createEnv({
    client: {
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1).startsWith('pk_').optional(),
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE: z.string().min(1).startsWith('pk_live_').optional(),
    },
    server: {
      STRIPE_SECRET_KEY: z.string().min(1).startsWith('sk_'),
      STRIPE_WEBHOOK_SECRET: z.string().min(1).startsWith('whsec_').optional(),
    },
    runtimeEnv: {
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
      STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE,
    },
  });