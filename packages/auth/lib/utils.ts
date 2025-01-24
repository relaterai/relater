import { LaterApiError } from '@repo/error';
import type { NextRequest } from 'next/server';

export interface UserProps {
  id: string;
  name: string;
  email: string;
  image?: string;
  createdAt: Date;
  source: string | null;
  isMachine: boolean;
  provider: string | null;
}

export const getAuthTokenOrThrow = (
  req: Request | NextRequest,
  type: 'Bearer' | 'Basic' = 'Bearer'
) => {
  const authorizationHeader = req.headers.get('Authorization');

  if (authorizationHeader) {
    if (!authorizationHeader.includes('Bearer ')) {
      throw new LaterApiError({
        code: 'bad_request',
        message:
          "Misconfigured authorization header. Did you forget to add 'Bearer '? Learn more: https://relater.ai/docs/auth",
      });
    }

    return authorizationHeader.replace(`${type} `, '');
  }
};

export const getSearchParams = (url: string) => {
  // Create a params object
  const params = {} as Record<string, string>;

  new URL(url).searchParams.forEach((val, key) => {
    params[key] = val;
  });

  return params;
};
