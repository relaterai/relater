import prisma from '@repo/database';
import kv from '@repo/kv';
import { waitUntil } from '@vercel/functions';

const UserDailySnapshotsCountPrefix = 'user-daily-snapshots-count';

export const getUserDailySnapshotsCount = async (userId: string) => {
  const key = `${UserDailySnapshotsCountPrefix}:${userId}`;
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

export const cleanUserDailySnapshotsCount = async (userId: string) => {
  const key = `${UserDailySnapshotsCountPrefix}:${userId}`;
  return await kv.del(key);
};
