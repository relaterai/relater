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

export const keys = () =>
  createEnv({
    server: {
      EMAIL_PROVIDER: z.enum(['RESEND', 'SES']),
      EMAIL_FROM: z.string().min(1).email(),
      RESEND_TOKEN: requiredWhenResend('RESEND_TOKEN'),
      AWS_SES_REGION: requiredWhenSes('AWS_SES_REGION'),
      AWS_ACCESS_KEY_ID: requiredWhenSes('AWS_ACCESS_KEY_ID'),
      AWS_SECRET_ACCESS_KEY: requiredWhenSes('AWS_SECRET_ACCESS_KEY'),

    },
    runtimeEnv: {
      RESEND_TOKEN: process.env.RESEND_TOKEN,
      EMAIL_PROVIDER: process.env.EMAIL_PROVIDER,
      EMAIL_FROM: process.env.EMAIL_FROM,
      AWS_SES_REGION: process.env.AWS_SES_REGION,
      AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
      AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });