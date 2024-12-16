import 'server-only';

import NextAuth from 'next-auth';
import { authOptions } from './lib/options';

export const { handlers: { GET, POST }, auth } = NextAuth(authOptions);
