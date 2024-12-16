import { withSession } from '@repo/auth/session';
import prisma from '@repo/database';
import { LaterApiError, handleAndReturnErrorResponse } from '@repo/error';
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
        email: true,
        // avatar: true,
        createdAt: true,
      },
    });
    if (!user) {
      throw new LaterApiError({
        code: 'not_found',
        message: 'User not found',
      });
    }
    return NextResponse.json(user);
  } catch (error) {
    req.log.error(error as string);
    return handleAndReturnErrorResponse(error);
  }
});

export const dynamic = 'force-dynamic';
