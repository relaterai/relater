import { Redis } from '@upstash/redis';
import { keys } from './keys';

const { KV_CONNECT_URL, KV_ACCESS_TOKEN } = keys();

const kv = new Redis({
  url: KV_CONNECT_URL,
  token: KV_ACCESS_TOKEN,
});

export default kv;
