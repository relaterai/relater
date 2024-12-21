import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

const requiredWhenSes = (key: string) =>
  z
    .string()
    .min(1)
    .optional()
    .refine((val) => !(process.env.EMAIL_PROVIDER === 'SES' && !val), {
      message: `${key} is required when EMAIL_PROVIDER is SES`,
    });

const requiredWhenResend = (key: string) =>
  z
    .string()
    .min(1)
    .startsWith('re_')
    .optional()
    .refine((val) => !(process.env.EMAIL_PROVIDER === 'RESEND' && !val), {
      message: `${key} is required when EMAIL_PROVIDER is RESEND`,
    });

const server: Parameters<typeof createEnv>[0]['server'] = {
  AUTH_SECRET: z.string().min(10),
  DATABASE_URL: z.string().min(1).url(),
  DATABASE_DIRECT_URL: z.string().min(1).url(),
  STRIPE_SECRET_KEY: z.string().min(1).startsWith('sk_'),
  STRIPE_WEBHOOK_SECRET: z.string().min(1).startsWith('whsec_').optional(),
  ANALYZE: z.string().optional(),

  OPENAI_API_KEY: z.string().min(1).startsWith('sk-').optional(),

  // Added by Sentry Integration, Vercel Marketplace
  SENTRY_ORG: z.string().min(1).optional(),
  SENTRY_PROJECT: z.string().min(1).optional(),

  // Added by Vercel
  VERCEL: z.string().optional(),
  NEXT_RUNTIME: z.enum(['nodejs', 'edge']).optional(),
  BLOB_READ_WRITE_TOKEN: z.string().min(1).optional(),

  // Email Provider
  EMAIL_PROVIDER: z.enum(['RESEND', 'SES']),
  EMAIL_FROM: z.string().min(1).email(),
  RESEND_TOKEN: requiredWhenResend('RESEND_TOKEN'),
  AWS_SES_REGION: requiredWhenSes('AWS_SES_REGION'),
  AWS_ACCESS_KEY_ID: requiredWhenSes('AWS_ACCESS_KEY_ID'),
  AWS_SECRET_ACCESS_KEY: requiredWhenSes('AWS_SECRET_ACCESS_KEY'),

  // Storage
  STORAGE_ACCESS_KEY_ID: z.string().min(1),
  STORAGE_SECRET_ACCESS_KEY: z.string().min(1),
  STORAGE_ENDPOINT: z.string().min(1).url(),
  STORAGE_REGION: z.string().min(1),
  STORAGE_UPLOAD_BUCKET: z.string().min(1),

  // Axiom Logger
  NEXT_PUBLIC_AXIOM_TOKEN: z.string().min(1).optional(),
  NEXT_PUBLIC_AXIOM_DATASET: z.string().min(1).optional(),
};

const client: Parameters<typeof createEnv>[0]['client'] = {
  NEXT_PUBLIC_APP_URL: z.string().min(1).url(),
  NEXT_PUBLIC_WEB_URL: z.string().min(1).url(),
  NEXT_PUBLIC_API_URL: z.string().min(1).url().optional(),
  NEXT_PUBLIC_DOCS_URL: z.string().min(1).url().optional(),
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().min(1).startsWith('G-').optional(),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1).startsWith('phc_'),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().min(1).url(),

  // Added by Vercel
  NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL: z.string().min(1),
};

export const env = createEnv({
  client,
  server,
  runtimeEnv: {
    // Auth
    AUTH_SECRET: process.env.AUTH_SECRET,

    // Database
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_DIRECT_URL: process.env.DATABASE_DIRECT_URL,
    // Stripe
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,

    ANALYZE: process.env.ANALYZE,
    SENTRY_ORG: process.env.SENTRY_ORG,
    SENTRY_PROJECT: process.env.SENTRY_PROJECT,
    VERCEL: process.env.VERCEL,
    NEXT_RUNTIME: process.env.NEXT_RUNTIME,
    BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,

    // APP URL
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_WEB_URL: process.env.NEXT_PUBLIC_WEB_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_DOCS_URL: process.env.NEXT_PUBLIC_DOCS_URL,
    NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL:
      process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL,

    // Email
    RESEND_TOKEN: process.env.RESEND_TOKEN,
    EMAIL_PROVIDER: process.env.EMAIL_PROVIDER,
    EMAIL_FROM: process.env.EMAIL_FROM,
    AWS_SES_REGION: process.env.AWS_SES_REGION,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,

    // Storage
    STORAGE_ACCESS_KEY_ID: process.env.STORAGE_ACCESS_KEY_ID,
    STORAGE_SECRET_ACCESS_KEY: process.env.STORAGE_SECRET_ACCESS_KEY,
    STORAGE_ENDPOINT: process.env.STORAGE_ENDPOINT,
    STORAGE_REGION: process.env.STORAGE_REGION,
    STORAGE_UPLOAD_BUCKET: process.env.STORAGE_UPLOAD_BUCKET,

    // Axiom Logger
    NEXT_PUBLIC_AXIOM_TOKEN: process.env.NEXT_PUBLIC_AXIOM_TOKEN,
    NEXT_PUBLIC_AXIOM_DATASET: process.env.NEXT_PUBLIC_AXIOM_DATASET,
  },
});
