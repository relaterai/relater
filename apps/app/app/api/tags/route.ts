import { getTags } from '@/lib/functions/tags/get-tags';
import { withSession } from '@repo/auth/session';
import { ResponseTagSchema, getTagsQuerySchema } from '@repo/zod/schemas/tags';
import { NextResponse } from 'next/server';

// GET /api/tags – get tags
export const GET = withSession(async ({ req, session, searchParams }) => {
  const { page, pageSize, withSnapshots, sort, name, ids, search, all } =
    getTagsQuerySchema.parse(searchParams);
  const { tags, counts } = await getTags({
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
    items: ResponseTagSchema.array().parse(tags),
    counts: counts,
  });
});
