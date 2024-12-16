import NextAuth, {NextAuthResult} from 'next-auth';
import { cache } from 'react';
import { authOptions } from './lib/options';

const { auth: uncachedAuth } = NextAuth(authOptions);

const auth: NextAuthResult['auth'] = cache(uncachedAuth);

export { auth };
