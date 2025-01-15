import { keys as database } from '@repo/database/keys';
import { keys as email } from '@repo/email/keys';
import { keys as observability } from '@repo/observability/keys';
import { keys as payments } from '@repo/payments/keys';
import { createEnv } from '@t3-oss/env-nextjs';

export const env = createEnv({
  extends: [database(), email(), payments(), observability()],
  server: {},
  client: {},
  runtimeEnv: {},
});