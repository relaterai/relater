import prisma from '@repo/database';
import kv from '@repo/kv';
import { waitUntil } from '@vercel/functions';

const UserSnapshotsCountPrefix = 'user-snapshots-count';

export const getUserSnapshotsCount = async (userId: string) => {
  const key = `${UserSnapshotsCountPrefix}:${userId}`;
  const cache = await kv.get(key);
  if (cache) {
    return cache;
  }
  const tags = await prisma.tag.count({
    where: {
      userId,
      isDeleted: false,
    },
  });
  waitUntil(kv.set(key, tags));
  return tags;
};

export const cleanUserSnapshotsCount = async (userId: string) => {
  const key = `${UserSnapshotsCountPrefix}:${userId}`;
  return await kv.del(key);
};
