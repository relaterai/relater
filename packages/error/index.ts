import { NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import { generateErrorMessage } from 'zod-error';
import { capitalize } from '../utils';

// Add more error codes here
export const ErrorCode = z.enum([
  'bad_request',
  'not_found',
  'internal_server_error',
  'unauthorized',
  'forbidden',
  'rate_limit_exceeded',
  'invite_expired',
  'invite_pending',
  'exceeded_limit',
  'conflict',
  'unprocessable_entity',
]);

const errorCodeToHttpStatus: Record<z.infer<typeof ErrorCode>, number> = {
  bad_request: 400,
  unauthorized: 401,
  forbidden: 403,
  exceeded_limit: 403,
  not_found: 404,
  conflict: 409,
  invite_pending: 409,
  invite_expired: 410,
  unprocessable_entity: 422,
  rate_limit_exceeded: 429,
  internal_server_error: 500,
};

const ErrorSchema = z.object({
  error: z.object({
    code: ErrorCode,
    message: z.string(),
    doc_url: z.string().optional(),
  }),
});

export type ErrorResponse = z.infer<typeof ErrorSchema>;
export type ErrorCodes = z.infer<typeof ErrorCode>;

export class LaterApiError extends Error {
  public readonly code: z.infer<typeof ErrorCode>;
  public readonly docUrl?: string;

  constructor({
    code,
    message,
    docUrl,
  }: {
    code: z.infer<typeof ErrorCode>;
    message: string;
    docUrl?: string;
  }) {
    super(message);
    this.code = code;
    this.docUrl = docUrl ?? `${docErrorUrl}#${code.replace('_', '-')}`;
  }
}

const docErrorUrl = 'https://later.run/docs/api-reference/errors';

export function fromZodError(error: ZodError): ErrorResponse {
  return {
    error: {
      code: 'unprocessable_entity',
      message: generateErrorMessage(error.issues, {
        maxErrors: 1,
        delimiter: {
          component: ': ',
        },
        path: {
          enabled: true,
          type: 'objectNotation',
          label: '',
        },
        code: {
          enabled: true,
          label: '',
        },
        message: {
          enabled: true,
          label: '',
        },
      }),
      doc_url: `${docErrorUrl}#unprocessable-entity`,
    },
  };
}

export function handleApiError(error: any): ErrorResponse & { status: number } {
  console.error('API error occurred', error.message);

  // Zod errors
  if (error instanceof ZodError) {
    return {
      ...fromZodError(error),
      status: errorCodeToHttpStatus.unprocessable_entity,
    };
  }

  // LaterApiError errors
  if (error instanceof LaterApiError) {
    return {
      error: {
        code: error.code,
        message: error.message,
        doc_url: error.docUrl,
      },
      status: errorCodeToHttpStatus[error.code],
    };
  }

  // Prisma record not found error
  if (error.code === 'P2025') {
    return {
      error: {
        code: 'not_found',
        message:
          error?.meta?.cause ||
          error.message ||
          'The requested resource was not found.',
        doc_url: `${docErrorUrl}#not-found`,
      },
      status: 404,
    };
  }

  // Fallback
  // Unhandled errors are not user-facing, so we don't expose the actual error
  return {
    error: {
      code: 'internal_server_error',
      message:
        'An internal server error occurred. Please contact our support if the problem persists.',
      doc_url: `${docErrorUrl}#internal-server-error`,
    },
    status: 500,
  };
}

export function handleAndReturnErrorResponse(
  err: unknown,
  headers?: Record<string, string>
) {
  const { error, status } = handleApiError(err);
  return NextResponse.json<ErrorResponse>({ error }, { headers, status });
}

export const exceededLimitError = ({
  plan,
  limit,
  type,
}: {
  plan: string;
  limit: number;
  type: 'storage' | 'AI';
}) => {
  return `You've reached your ${
    type === 'storage' || type === 'AI' ? 'monthly' : ''
  } limit of ${limit} ${
    limit === 1 ? type.slice(0, -1) : type
  } on the ${capitalize(plan)} plan. Please upgrade to add more ${type}.`;
};
