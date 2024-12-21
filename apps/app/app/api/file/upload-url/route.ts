import { parseRequestBody } from '@/lib/utils';
import { withSession } from '@repo/auth/session';
import { getPreSignedPutUrl } from '@repo/storage';
import { fileUploadPreSignedUrlSchema } from '@repo/zod/schemas/file';
import { NextResponse } from 'next/server';

// POST /api/file/upload-url – get a signed URL to upload a screenshot or webpage archive
export const POST = withSession(async ({ session, req }) => {
  const { fileName, contentType, bucket, ttl } =
    fileUploadPreSignedUrlSchema.parse(await parseRequestBody(req));

  const res = await getPreSignedPutUrl(
    fileName,
    session.user.id,
    contentType,
    bucket,
    ttl
  );

  return NextResponse.json(res);
});
