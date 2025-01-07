import { env } from '@repo/env';
import { Redis } from '@upstash/redis';

const kv = new Redis({
  url: env.KV_CONNECT_URL,
  token: env.KV_ACCESS_TOKEN,
});

export default kv;
