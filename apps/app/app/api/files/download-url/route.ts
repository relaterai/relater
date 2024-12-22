import { parseRequestBody } from '@/lib/utils';
import { withSession } from '@repo/auth/session';
import { env } from '@repo/env';
import { LaterApiError } from '@repo/error';
import { getPreSignedGetUrl } from '@repo/storage';
import { fileDownloadPreSignedUrlSchema } from '@repo/zod/schemas/file';
import { NextResponse } from 'next/server';

// POST /api/files/download-url – get a signed URL to retrieve a screenshot or webpage archive
export const POST = withSession(async ({ req, session }) => {
  const { key } = fileDownloadPreSignedUrlSchema
    .omit({
      ttl: true,
      bucket: true,
    })
    .parse(await parseRequestBody(req));

  if (!key.startsWith(session.user.id)) {
    throw new LaterApiError({
      code: 'forbidden',
      message: 'You are not allowed to access this resource.',
    });
  }

  const signedUrl = await getPreSignedGetUrl(
    key,
    env.STORAGE_UPLOAD_BUCKET,
    600
  );
  return NextResponse.json({ key, signedUrl });
});
