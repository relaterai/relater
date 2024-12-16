import NextAuth from 'next-auth';
import { authOptions } from './lib/options';

export const { signIn, signOut } = NextAuth(authOptions);
