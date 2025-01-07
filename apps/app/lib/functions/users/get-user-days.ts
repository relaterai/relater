import prisma from '@repo/database';

export const getUserRegDays = async ({
  userId,
  createdAt,
}: {
  userId?: string;
  createdAt?: Date;
}) => {
  if (!createdAt) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { createdAt: true },
    });

    if (!user) {
      return 0;
    }
    createdAt = user.createdAt;
  }

  const now = new Date();
  const diffTime = Math.abs(now.getTime() - createdAt.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};
