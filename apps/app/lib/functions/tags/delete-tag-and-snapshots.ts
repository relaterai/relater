import prisma from '@repo/database';
import type z from '@repo/zod';
import type { deleteTagSchema } from '@repo/zod/schemas/tags';

// Delete tag and related snapshots
export async function deleteTagAndSnapshots({
  id,
  userId,
}: z.infer<typeof deleteTagSchema> & { userId: string }) {
  const tag = await prisma.$transaction(async (tx) => {
    await tx.tag.update({
      where: {
        id,
        userId,
      },
      data: {
        snapshots: {
          updateMany: {
            where: {
              userId,
            },
            data: {
              isDeleted: true,
            },
          },
        },
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
