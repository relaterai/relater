import { deleteTagAndSnapshots } from '@/lib/functions/tags/delete-tag-and-snapshots';
import { disconnectTags } from '@/lib/functions/tags/disconnect-tags';
import { parseRequestBody } from '@/lib/utils';
import { withSession } from '@repo/auth/session';
import prisma from '@repo/database';
import type z from '@repo/zod';
import {
  TagSchema,
  deleteTagQuerySchema,
  updateTagSchema,
} from '@repo/zod/schemas/tags';
import { NextResponse } from 'next/server';

// PATCH /api/tags/:id - update a specific tag
export const PATCH = withSession(async ({ session, params, req }) => {
  const { name, color, emoji, pinned } = updateTagSchema.parse(
    await parseRequestBody(req)
  );

  const tag = await prisma.snapshot.update({
    where: {
      id: params.id,
      userId: session.user.id,
    },
    data: {
      ...(name && { name }),
      ...(color && { color }),
      ...(emoji && { emoji }),
      ...(pinned && { pinned }),
    },
  });

  return NextResponse.json(TagSchema.parse(tag));
});

// DELETE /api/tags/:id - permanently delete a tag
export const DELETE = withSession(async ({ session, params, searchParams }) => {
  const { deleteSnapshot } = deleteTagQuerySchema.parse(searchParams);
  let res: { tag: z.infer<typeof TagSchema> };
  if (deleteSnapshot) {
    res = await deleteTagAndSnapshots({
      id: params.id,
      userId: session.user.id,
    });
  } else {
    res = await disconnectTags({
      id: params.id,
      userId: session.user.id,
    });
  }

  return NextResponse.json(TagSchema.parse(res.tag));
});
