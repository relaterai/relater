import { withSession } from '@repo/auth/session';
import { storage } from '@repo/storage';
import { nanoid } from '@repo/utils';
import { NextResponse } from 'next/server';

// POST /api/upload-url – get a signed URL to upload a screenshot or webpage archive
export const POST = withSession(async ({ session }) => {
  const key = `/snapshots/${session.user.id}/${nanoid(16)}`;

  const signedUrl = await storage.getSignedUrl(key);

  return NextResponse.json({ key, signedUrl });
});
