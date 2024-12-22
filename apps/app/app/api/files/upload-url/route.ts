import { env } from 'node:process';
import { parseRequestBody } from '@/lib/utils';
import { withSession } from '@repo/auth/session';
import { getPreSignedPutUrl } from '@repo/storage';
import { fileUploadPreSignedUrlSchema } from '@repo/zod/schemas/file';
import { NextResponse } from 'next/server';

// POST /api/files/upload-url – get a signed URL to upload a screenshot or webpage archive
export const POST = withSession(async ({ session, req }) => {
  const { fileName, contentType } = fileUploadPreSignedUrlSchema
    .omit({
      ttl: true,
      bucket: true,
    })
    .parse(await parseRequestBody(req));

  const res = await getPreSignedPutUrl(
    fileName,
    session.user.id,
    contentType,
    env.STORAGE_UPLOAD_BUCKET,
    600
  );

  return NextResponse.json(res);
});
