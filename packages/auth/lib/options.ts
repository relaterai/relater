import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from '@repo/database/edge';
import { env } from '@repo/env';
import type { NextAuthConfig } from "next-auth"
import type { User } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import type { AdapterUser } from 'next-auth/adapters';
import type { JWT } from 'next-auth/jwt';
import type { UserProps } from '@/lib/utils';
import { sendVerificationRequest } from './authSendRequest';

export const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  // debug: true,
  pages: {
    signIn: '/sign-in',
  },
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    {
      id: 'email',
      name: 'Email',
      type: 'email',
      maxAge: 60 * 10, // Email link will expire in 10 mins
      sendVerificationRequest,
    },
  ],
  callbacks: {
    session: async ({ session, token }) => {
      session.user = {
        id: token.sub,
        // @ts-ignore
        ...(token || session).user,
      };
      return session;
    },
    async jwt({
      token,
      user,
      trigger,
    }: {
      token: JWT;
      user: User | AdapterUser | UserProps;
      trigger?: 'signIn' | 'update' | 'signUp';
    }) {
      if (user) {
        token.id = user.id;
      }

      // refresh the user's data if they update their name / email
      if (trigger === 'update') {
        const refreshedUser = await prisma.user.findUnique({
          where: { id: token.sub },
        });
        if (refreshedUser) {
          token.user = refreshedUser;
        } else {
          return {};
        }
      }

      return token;
    },
  },
  // events: {
  //   // @ts-ignore
  //   signIn: async (message) => {
  //     if (message.isNewUser) {
  //       const email = message.user.email as string;
  //       const user = await prisma.user.findUnique({
  //         where: { email },
  //         select: {
  //           id: true,
  //           name: true,
  //           email: true,
  //           // avatar: true,
  //           createdAt: true,
  //         },
  //       });
  //       if (!user) {
  //         return;
  //       }

  //       //  set refer user
  //       if (user && user.email) {
  //         // const referredByUser = (await cookies()).get('referralCode')?.value;
  //         await prisma.$transaction(async (tx) => {
  //           // await tx.user.update({
  //           //   where: {
  //           //     id: user.id,
  //           //   },
  //           //   data: {
  //           //     referredByUserId: referredByUser ? referredByUser : undefined,
  //           //   },
  //           // });
  //           await tx.folder.create({
  //             data: {
  //               name: 'Default',
  //               userId: user.id,
  //             },
  //           });
  //         });

  //         // only send the welcome email if the user was created in the last 10s
  //         // (this is a workaround because the `isNewUser` flag is triggered when a user does `dangerousEmailAccountLinking`)
  //         if (
  //           user.createdAt &&
  //           new Date(user.createdAt).getTime() > Date.now() - 10000
  //         ) {
  //           // TODO send welcome email
  //         }
  //       }
  //     }
  //   },
  // },
};
