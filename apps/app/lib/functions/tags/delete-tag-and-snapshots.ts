import prisma from '@repo/database';
import type z from '@repo/zod';
import type { deleteTagSchema } from '@repo/zod/schemas/tags';

// Delete tag and related snapshots
export async function deleteTagAndSnapshots({
  id,
  userId,
}: z.infer<typeof deleteTagSchema> & { userId: string }) {
  // const tag = await prisma.$transaction(async (tx) => {
  //   await tx.tag.update({
  //     where: {
  //       id,
  //       userId,
  //     },
  //     data: {
  //       snapshots: {
  //         updateMany: {
  //           where: {
  //             userId,
  //           },
  //           data: {
  //             isDeleted: true,
  //             deletedAt: new Date(),
  //           },
  //         },
  //       },
  //     },
  //   });
  //   return await tx.tag.update({
  //     where: {
  //       id,
  //       userId,
  //     },
  //     data: {
  //       isDeleted: true,
  //       deletedAt: new Date(),
  //     },
  //   });
  // });

  const tag = await prisma.tag.update({
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
            deletedAt: new Date(),
          },
        },
      },
    },
  });

  await prisma.tag.update({
    where: {
      id,
      userId,
    },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });

  return {
    tag,
  };
}
