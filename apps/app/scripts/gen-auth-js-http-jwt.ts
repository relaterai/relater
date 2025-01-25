import { randomBytes } from 'crypto';
import { encode } from '@auth/core/jwt';
import { env } from '../env';
async function main() {
  const jwt = await encode({
    token: {
      id: 'auth-js-http-adapter',
    },
    secret: env.AUTH_SECRET!,
    salt: randomBytes(4).toString('base64'),
  });
  console.log(`AUTH_HTTP_ADAPTER_JWT='${jwt}'`);
}

main();
