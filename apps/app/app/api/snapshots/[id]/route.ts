import { signedFileUrl } from '@/lib/functions/snapshots/signed-file-url';
import { updateSnapshotWithTags } from '@/lib/functions/snapshots/update-snapshot-with-tags';
import { parseRequestBody } from '@/lib/utils';
import { withSession } from '@repo/auth/session';
import prisma from '@repo/database';
import type z from '@repo/zod';
import {
  type SnapshotSchema,
  updateSnapshotSchema,
} from '@repo/zod/schemas/snapshots';
import { NextResponse } from 'next/server';

// GET /api/snapshots/:id - get a specific snapshot
export const GET = withSession(async ({ session, params }) => {
  const snapshot = await prisma.snapshot.findUnique({
    where: {
      id: params.id,
      userId: session.user.id,
    },
    include: {
      tags: true
    }
  });

  if (!snapshot) {
    return new NextResponse('Snapshot not found', { status: 404 });
  }

  const [signedSnapshot] = await signedFileUrl([snapshot]);

  return NextResponse.json(signedSnapshot);
});


// PATCH /api/snapshots/:id - update a specific snapshot
export const PATCH = withSession(async ({ session, params, req }) => {
  const { note, tags, pinned, isDeleted } = updateSnapshotSchema
    .omit({
      snapshotId: true,
    })
    .parse(await parseRequestBody(req));
  let snapshot: z.infer<typeof SnapshotSchema>;
  if (tags) {
    snapshot = await updateSnapshotWithTags({
      userId: session.user.id,
      snapshotId: params.id,
      tags,
      note,
      pinned,
      isDeleted,
    });
  } else {
    snapshot = await prisma.snapshot.update({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      data: {
        ...(note && { note }),
        ...(pinned !== null && typeof pinned === 'boolean' && { pinned }),
        ...(isDeleted !== null &&
          typeof isDeleted === 'boolean' && { isDeleted }), // Move to trash or restore from trash
      },
    });
  }

  // return NextResponse.json(SnapshotSchema.parse(snapshot));
  return NextResponse.json(snapshot);
});

// DELETE /api/snapshots/:id - permanently delete a snapshot from trash
export const DELETE = withSession(async ({ session, params }) => {
  const snapshot = await prisma.snapshot.delete({
    where: {
      id: params.id,
      userId: session.user.id,
    },
    select: {
      id: true,
      user: {
        select: {
          id: true,
        },
      },
    },
  });

  return NextResponse.json({
    id: snapshot.id,
  });
});
