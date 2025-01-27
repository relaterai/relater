import prisma from '@repo/database';
import { LaterApiError } from '@repo/error';
import { isBoolean } from '@repo/utils';
import type z from '@repo/zod';
import type {
  SnapshotSchema,
  updateSnapshotSchema,
} from '@repo/zod/schemas/snapshots';

/**
 * Updates a snapshot with the provided tags
 * @param snapshotId The snapshot to update
 * @param tags Array of tags to set
 * @param note The note to set
 * @param pinned Whether to pin the snapshot
 * @param isDeleted Whether to move the snapshot to trash
 * @returns Updated snapshot object
 */
export async function updateSnapshotWithTags({
  userId,
  snapshotId,
  tags,
  note,
  pinned,
  isDeleted,
  title,
}: z.infer<typeof updateSnapshotSchema> & {
  userId: string;
}): Promise<z.infer<typeof SnapshotSchema>> {
  const snapshot = await prisma.snapshot.findUnique({
    where: {
      id: snapshotId,
      userId,
    },
    include: {
      tags: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!snapshot) {
    throw new LaterApiError({
      code: 'not_found',
      message: 'Snapshot not found',
    });
  }

  // Ensure tags is an array and remove any duplicates
  const uniqueTags = [...new Set(tags)].filter(Boolean);
  const diffTags = uniqueTags.filter(
    (tag) => !snapshot.tags.some((t) => t.name === tag)
  );
  const deletedTags = snapshot.tags.filter(
    (tag) => !uniqueTags.some((t) => t === tag.name)
  );

  // Create new tags
  await prisma.snapshot.update({
    where: {
      id: snapshot.id,
    },
    data: {
      tags: {
        connectOrCreate: diffTags.map((tag) => {
          const tagsSplit = tag.split('/');
          return {
            where: {
              userId_name: {
                userId: snapshot.userId,
                name: tag,
              },
            },
            create: {
              name: tag,
              userId: snapshot.userId,
              firstPath: tagsSplit[0],
              pathSegments: tagsSplit.map((_, index) => {
                return tagsSplit.slice(0, index + 1).join('/');
              }),
            },
          };
        }),
      },
    },
  });

  // Disconnect deleted tags
  await prisma.snapshot.update({
    where: {
      id: snapshot.id,
      userId: snapshot.userId,
    },
    data: {
      ...(title && { title }),
      ...(note && { note }),
      ...(isBoolean(pinned) && { pinned }),
      ...(isBoolean(isDeleted) && { isDeleted }), // Move to trash
      tags: {
        disconnect: deletedTags.map((tag) => ({ id: tag.id })),
      },
    },
  });

  // TODO: remove tags who has no snapshot

  return snapshot;
}
