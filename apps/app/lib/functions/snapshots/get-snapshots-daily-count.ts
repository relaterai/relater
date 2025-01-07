import prisma from '@repo/database';
import kv from '@repo/kv';
import { waitUntil } from '@vercel/functions';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

const UserSnapshotsDailyCountPrefix = 'user-snapshots-daily-count';
// get the count of snapshots created in the last before the start of the day
export const getSnapshotsDailyCount = async (
  userId: string,
  startDate: Date,
  endDate: Date
) => {
  const key = `${UserSnapshotsDailyCountPrefix}:${userId}}`;
  const cache = await kv.get(key);

  let _dailySnapshots;
  if (cache) {
    // console.log('cache', cache);
    // _dailySnapshots = JSON.parse(cache as string);
    _dailySnapshots = cache as { day: string; count: number }[];
  }

  if (!_dailySnapshots) {
    _dailySnapshots = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('day', "created_at" AT TIME ZONE 'UTC') as day,
        COUNT(*) as count
      FROM "snapshots"
      WHERE 
        "user_id" = ${userId}
        AND "is_deleted" = false
        AND "created_at" >= ${startDate}
        AND "created_at" < ${endDate}
        GROUP BY day
        ORDER BY day
      `;
  }
  const dailySnapshots = (
    _dailySnapshots as { day: string; count: number }[]
  ).map((snapshot) => {
    return {
      day: snapshot.day,
      count:
        typeof snapshot.count === 'bigint'
          ? Number(snapshot.count)
          : snapshot.count,
    };
  });

  waitUntil(kv.set(key, JSON.stringify(dailySnapshots), { ex: 60 * 60 * 1 }));

  const todaysCount = await prisma.snapshot.count({
    where: {
      userId,
      isDeleted: false,
      createdAt: {
        gte: dayjs(startDate).startOf('day').toDate(),
        lt: dayjs(endDate).add(1, 'day').startOf('day').toDate(),
      },
    },
  });

  // Build snapshot counts for all dates in range
  const dailySnapshotsMap = dailySnapshots.reduce(
    (acc, snapshot) => {
      acc[dayjs(snapshot.day).startOf('day').toISOString()] = snapshot.count;
      return acc;
    },
    {} as Record<string, number>
  );

  let currentDate = dayjs(startDate).startOf('day');
  const endDateTime = dayjs(endDate).startOf('day');
  const dailySnapshotsCount: Record<string, number> = {};

  while (
    currentDate.isBefore(endDateTime, 'day') ||
    currentDate.isAfter(endDateTime, 'day')
  ) {
    const dateStr = currentDate.startOf('day').toISOString();
    dailySnapshotsCount[dateStr] = dailySnapshotsMap[dateStr] || 0;
    currentDate = currentDate.add(1, 'day');
  }

  dailySnapshotsCount[dayjs(endDate).startOf('day').toISOString()] =
    todaysCount;

  return dailySnapshotsCount;
};
