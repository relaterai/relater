import prisma from '@repo/database';
import type z from '@repo/zod';
import type { disconnectTagsSchema } from '@repo/zod/schemas/tags';

// Delete tag only, without deleting related snapshots
export async function disconnectTags({
  id,
  userId,
}: z.infer<typeof disconnectTagsSchema> & { userId: string }) {
  const tag = await prisma.$transaction(async (tx) => {
    await tx.tag.update({
      where: {
        id,
        userId,
      },
      data: {
        snapshots: {
          set: [],
        },
      },
      include: {
        snapshots: true,
      },
    });
    return await tx.tag.delete({
      where: {
        id,
        userId,
      },
    });
  });

  return {
    tag,
  };
}
