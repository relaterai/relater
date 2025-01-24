import type { Session } from '@auth/core/types';
import { LaterApiError, handleAndReturnErrorResponse } from '@repo/error';
import { type AxiomRequest, withAxiom } from 'next-axiom';
import {
  getSearchParams,
} from './lib/utils';
import { auth } from './server';
import { hashToken } from './hash-token';
import prisma from '@repo/database';
import { waitUntil } from '@vercel/functions';

type WithSessionHandler = ({
  req,
  params,
  searchParams,
  session,
}: {
  req: AxiomRequest;
  params: Record<string, string>;
  searchParams: Record<string, string>;
  session: Session;
}) => Promise<Response>;

export const withSession = (handler: WithSessionHandler) =>
  withAxiom(
    async (
      req: AxiomRequest,
      { params = {} }: { params: Record<string, string> | undefined }
    ) => {
      try {
        let session: Session | null = null;
        const authorizationHeader = req.headers.get("Authorization");
        if (authorizationHeader) {
          if (!authorizationHeader.includes("Bearer ")) {
            throw new LaterApiError({
              code: "bad_request",
              message:
                "Misconfigured authorization header. Did you forget to add 'Bearer '? Learn more: https://relater.ai/docs/auth",
            });
          }
          const apiKey = authorizationHeader.replace("Bearer ", "");

          const hashedKey = await hashToken(apiKey);

          const user = await prisma.user.findFirst({
            where: {
              tokens: {
                some: {
                  hashedKey,
                },
              },
            },
            select: {
              id: true,
              name: true,
              email: true,
              stripeId: true,
            },
          });
          if (!user) {
            throw new LaterApiError({
              code: "unauthorized",
              message: "Unauthorized: Invalid API key.",
            });
          }

          // TODO: Implement rate limiting
          // const { success, limit, reset, remaining } = await ratelimit(
          //   600,
          //   "1 m",
          // ).limit(apiKey);

          // headers = {
          //   "Retry-After": reset.toString(),
          //   "X-RateLimit-Limit": limit.toString(),
          //   "X-RateLimit-Remaining": remaining.toString(),
          //   "X-RateLimit-Reset": reset.toString(),
          // };

          // if (!success) {
          //   return new Response("Too many requests.", {
          //     status: 429,
          //     headers,
          //   });
          // }

          waitUntil(
            prisma.token.update({
              where: {
                hashedKey,
              },
              data: {
                lastUsed: new Date(),
              },
            }),
          );
          session = {
            user: {
              id: user.id,
              name: user.name || "",
              email: user.email || "",
              stripeId: user.stripeId || "",
            },
          };
        } else {
          session = await auth();
          if (!session || !session?.user || !session?.user?.id) {
            throw new LaterApiError({
              code: 'unauthorized',
              message: 'Unauthorized: Login required.',
            });
          }
        }
        const searchParams = getSearchParams(req.url);
        return await handler({ req, params: await params, searchParams, session });
      } catch (error) {
        if (error instanceof LaterApiError) {
          req.log.error(error.message ?? error);
          return handleAndReturnErrorResponse(error);
        } else {
          throw error;
        }
      }
    }
  );
