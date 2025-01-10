import { parseRequestBody } from '@/lib/utils';
import { withSession } from '@repo/auth/session';
import prisma from '@repo/database';
import { LaterApiError, handleAndReturnErrorResponse } from '@repo/error';
import { getPreSignedGetUrl } from '@repo/storage';
import { updateUserSchema } from '@repo/zod/schemas/users';
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
        image: true,
        createdAt: true,
      },
    });
    if (!user) {
      throw new LaterApiError({
        code: 'not_found',
        message: 'User not found',
      });
    }
    return NextResponse.json({
      ...user,
      image: await getPreSignedGetUrl(user.image || "")
    });
  } catch (error) {
    req.log.error(error as string);
    return handleAndReturnErrorResponse(error);
  }
});

// PATCH /api/user
export const PATCH = withSession(async ({ req, session }) => {
  const { name, email, image } = updateUserSchema.parse(
    await parseRequestBody(req)
  );
  const user = await prisma.user.update({
    where: { id: session.user?.id },
    data: {
      name: name ?? undefined,
      email: email ?? undefined,
      image: image ?? undefined,
    },
  });
  return NextResponse.json(user);
});

export const dynamic = 'force-dynamic';
