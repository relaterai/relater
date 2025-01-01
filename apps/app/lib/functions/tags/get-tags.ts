import prisma, { type Prisma } from '@repo/database';
import type z from '@repo/zod';
import type { getTagsQuerySchema } from '@repo/zod/schemas/tags';

type GetTagsParams = z.infer<typeof getTagsQuerySchema> & {
  userId: string;
};

export async function getTags({
  userId,
  search,
  name,
  ids,
  withSnapshots = false,
  withSnapshotsCount = true,
  sort = 'createdAt',
}: GetTagsParams) {
  const where: Prisma.TagWhereInput = {
    userId,
    isDeleted: false,
    // Search conditions
    ...(search && {
      OR: [{ name: { contains: search } }],
    }),
    // Tag filtering conditions
    ...(name || ids
      ? {
          tags: {
            some: {
              OR: [
                // TODO: Evaluate startsWith performance, consider using raw SQL start_with function if Prisma startsWith performance is suboptimal
                ...(name ? [{ name: { startsWith: name } }] : []),
                ...(ids ? [{ id: { in: ids } }] : []),
              ],
            },
          },
        }
      : {}),
  };

  // Get paginated data
  const tags = await prisma.tag.findMany({
    where,
    include: {
      _count: withSnapshotsCount
        ? {
            select: {
              snapshots: {
                where: {
                  isDeleted: false,
                },
              },
            },
          }
        : false,
      snapshots: withSnapshots
        ? {
            select: {
              id: true,
              title: true,
              summary: true,
              note: true,
              createdAt: true,
            },
          }
        : false,
    },
    orderBy: [{ [sort]: 'desc' }],
  });
  return {
    tags,
  };
}
