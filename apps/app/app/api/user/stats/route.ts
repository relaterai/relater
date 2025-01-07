import { getSnapshotsDailyCount } from '@/lib/functions/snapshots/get-snapshots-daily-count';
import { getUserRegDays } from '@/lib/functions/users/get-user-days';
import { getUserSnapshotsCount } from '@/lib/functions/users/get-user-snapshots-count';
import { getUserTagsCount } from '@/lib/functions/users/get-user-tags-count';
import { withSession } from '@repo/auth/session';
import prisma from '@repo/database';
import { LaterApiError, handleAndReturnErrorResponse } from '@repo/error';
import dayjs from 'dayjs';
import { NextResponse } from 'next/server';

export const GET = withSession(async ({ req, session }) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: session.user?.id,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
    });
    if (!user) {
      throw new LaterApiError({
        code: 'not_found',
        message: 'User not found',
      });
    }
    const [regDays, tagsCount, snapshotsCount, dailySnapshotsCount] =
      await Promise.all([
        getUserRegDays({ userId: user.id }),
        getUserTagsCount(user.id),
        getUserSnapshotsCount(user.id),
        getSnapshotsDailyCount(
          user.id,
          dayjs().subtract(84, 'day').toDate(),
          dayjs().toDate()
        ),
      ]);
    return NextResponse.json({
      regDays,
      tagsCount,
      snapshotsCount,
      dailySnapshotsCount,
    });
  } catch (error) {
    req.log.error(error as string);
    return handleAndReturnErrorResponse(error);
  }
});

export const dynamic = 'force-dynamic';
