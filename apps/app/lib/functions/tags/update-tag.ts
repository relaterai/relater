import prisma from '@repo/database';
import type z from '@repo/zod';
import type { updateTagSchema } from '@repo/zod/schemas/tags';

type UpdateTagParams = z.infer<typeof updateTagSchema> & {
  userId: string;
  tagId: string;
};

export async function updateTag({
  userId,
  tagId,
  name,
  color,
  emoji,
  pinned,
}: UpdateTagParams) {
  const tag = await prisma.tag.update({
    where: {
      id: tagId,
      userId,
    },
    data: {
      ...(name && { name }),
      ...(color && { color }),
      ...(emoji && { emoji }), // TODO: This change requires membership
      ...(pinned && { pinned }),
    },
  });

  return {
    tag,
  };
}
