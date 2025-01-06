import { openKv } from '@deno/kv';
import { env } from '@repo/env';

// Connect to a KV instance
const kv = await openKv(env.KV_CONNECT_URL, {
  accessToken: env.KV_ACCESS_TOKEN,
});

export default kv;
