import { parseRequestBody } from '@/lib/utils';
import { withSession } from '@repo/auth/session';
import prisma from '@repo/database';
import { tokenSchema, updateTokenSchema } from '@repo/zod/schemas/token';
import { NextResponse } from 'next/server';

// PATCH /api/tokens/:id - update a specific token
export const PATCH = withSession(async ({ session, params, req }) => {
  const { name } = updateTokenSchema.parse(await parseRequestBody(req));

  const token = await prisma.token.update({
    where: {
      id: params.id,
      userId: session.user.id,
    },
    data: {
      ...(name && { name }),
    },
    select: {
      id: true,
      name: true,
      partialKey: true,
      lastUsed: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });

  return NextResponse.json(tokenSchema.parse(token));
});

// DELETE /api/tokens/:id - delete a specific token
export const DELETE = withSession(async ({ session, params }) => {
  const token = await prisma.token.delete({
    where: {
      id: params.id,
      userId: session.user.id,
    },
    select: {
      id: true,
      user: {
        select: {
          id: true,
        },
      },
    },
  });

  return NextResponse.json({
    id: token.id,
  });
});
