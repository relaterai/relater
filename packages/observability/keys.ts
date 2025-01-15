import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const keys = () =>
  createEnv({
    server: {
      // @ts-ignore
      NEXT_PUBLIC_AXIOM_TOKEN: z.string().min(1).optional(),
      // @ts-ignore
      NEXT_PUBLIC_AXIOM_DATASET: z.string().min(1).optional(),
    },
    runtimeEnv: {
      NEXT_PUBLIC_AXIOM_TOKEN: process.env.NEXT_PUBLIC_AXIOM_TOKEN,
      NEXT_PUBLIC_AXIOM_DATASET: process.env.NEXT_PUBLIC_AXIOM_DATASET,
    },
  });
