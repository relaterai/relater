import { getTags } from '@/lib/functions/tags/get-tags';
import { parseRequestBody } from '@/lib/utils';
import { withSession } from '@repo/auth/session';
import { TagSchema, getTagsQuerySchema } from '@repo/zod/schemas/tags';
import { NextResponse } from 'next/server';

// GET /api/tags – get tags
export const GET = withSession(async ({ req, session }) => {
  const { page, pageSize, withSnapshots, sort, name, ids, search, all } =
    getTagsQuerySchema.parse(await parseRequestBody(req));
  const { tags } = await getTags({
    userId: session.user.id,
    page,
    pageSize,
    withSnapshots,
    sort,
    name,
    ids,
    search,
    withSnapshotsCount: true,
    all,
  });

  return NextResponse.json({
    items: TagSchema.array().parse(tags),
  });
});
