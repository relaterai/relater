import { keys as ai } from '@repo/ai/keys';
import { keys as analytics } from '@repo/analytics/keys';
import { keys as auth } from '@repo/auth/keys';
import { keys as database } from '@repo/database/keys';
import { keys as email } from '@repo/email/keys';
import { keys as kv } from '@repo/kv/keys';
import { keys as core } from '@repo/next-config/keys';
import { keys as observability } from '@repo/observability/keys';
import { createEnv } from '@t3-oss/env-nextjs';

export const env = createEnv({
  extends: [
    ai(),
    auth(),
    analytics(),
    core(),
    database(),
    email(),
    kv(),
    observability(),
  ],
  server: {},
  client: {},
  runtimeEnv: {},
});