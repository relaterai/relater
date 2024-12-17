import type { Session } from '@auth/core/types';
import { LaterApiError, handleAndReturnErrorResponse } from '@repo/error';
import { type AxiomRequest, withAxiom } from 'next-axiom';
import {
  getSearchParams,
} from './lib/utils';
import { auth } from './server';

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
        const session = (await auth()) as Session;
        if (!session || !session?.user || !session?.user?.id) {
          throw new LaterApiError({
            code: 'unauthorized',
            message: 'Unauthorized: Login required.',
          });
        }
        const searchParams = getSearchParams(req.url);
        return await handler({ req, params, searchParams, session });
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
