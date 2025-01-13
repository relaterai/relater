import prisma, { type Prisma } from '@repo/database';
import type z from '@repo/zod';
import type { getSnapshotsQuerySchema } from '@repo/zod/schemas/snapshots';
import { signedFileUrl } from './signed-file-url';

type GetSnapshotsParams = z.infer<typeof getSnapshotsQuerySchema> & {
  userId: string;
  isDeleted?: boolean;
};

export async function getSnapshots({
  userId,
  search,
  tagName,
  tagIds,
  withTags = true,
  page = 1,
  pageSize = 10,
  withCount = true,
  sort = 'createdAt',
  isDeleted = false
}: GetSnapshotsParams) {
  const skip = (page - 1) * pageSize;

  const where: Prisma.SnapshotWhereInput = {
    userId,
    ...(isDeleted !== undefined && { isDeleted }),
    // Search conditions
    ...(search && {
      OR: [
        { title: { contains: search } },
        { summary: { contains: search } },
        { note: { contains: search } },
      ],
    }),
    // Tag filtering conditions
    ...(tagName || tagIds
      ? {
          tags: {
            some: {
              OR: [
                // TODO: Evaluate startsWith performance, consider using raw SQL start_with function if Prisma startsWith performance is suboptimal
                ...(tagName ? [{ name: { startsWith: tagName } }] : []),
                ...(tagIds ? [{ id: { in: tagIds } }] : []),
              ],
            },
          },
        }
      : {}),
  };

  // Get total count
  const total = withCount ? await prisma.snapshot.count({ where }) : 0;

  // Get paginated data
  const snapshots = await prisma.snapshot.findMany({
    where,
    include: {
      tags: withTags
        ? {
            select: {
              id: true,
              name: true,
              color: true,
              emoji: true,
            },
          }
        : false,
    },
    orderBy: [{ [sort]: 'desc' }],
    take: pageSize,
    skip,
  });

  return {
    snapshots: await signedFileUrl(snapshots),
    pagination: {
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  };
}
