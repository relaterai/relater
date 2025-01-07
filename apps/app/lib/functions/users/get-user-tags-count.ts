import prisma from '@repo/database';
import kv from '@repo/kv';
import { waitUntil } from '@vercel/functions';

const UserTagsCountPrefix = 'user-tags-count';

export const getUserTagsCount = async (userId: string) => {
  const key = `${UserTagsCountPrefix}:${userId}`;
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

export const cleanUserTagsCount = async (userId: string) => {
  const key = `${UserTagsCountPrefix}:${userId}`;
  return await kv.del(key);
};
