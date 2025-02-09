import { parseRequestBody } from '@/lib/utils';
import { hashToken } from '@repo/auth/hash-token';
import { withSession } from '@repo/auth/session';
import prisma from '@repo/database';
import { sendEmail } from '@repo/email';
import apiKeyCreated from '@repo/email/templates/api-key-created';
import { nanoid } from '@repo/utils';
import { createTokenSchema, tokenSchema } from '@repo/zod/schemas/token';
import { waitUntil } from '@vercel/functions';
import { NextResponse } from 'next/server';

// GET /api/tokens - get all tokens
export const GET = withSession(async ({ session }) => {
  const tokens = await prisma.token.findMany({
    where: {
      userId: session.user.id,
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
          isMachine: true,
        },
      },
    },
    orderBy: [{ lastUsed: 'desc' }, { createdAt: 'desc' }],
  });

  return NextResponse.json(tokenSchema.array().parse(tokens));
});

// POST /api/tokens – create a new token
export const POST = withSession(async ({ req, session }) => {
  const { name } = createTokenSchema.parse(await parseRequestBody(req));

  // Create token
  const token = `relater_${nanoid(24)}`;
  const hashedKey = await hashToken(token);
  const partialKey = `${token.slice(0, 3)}...${token.slice(-4)}`;

  await prisma.token.create({
    data: {
      name,
      hashedKey,
      partialKey,
      userId: session.user.id,
      rateLimit: 60,
    },
  });

  waitUntil(
    sendEmail({
      email: session.user.email,
      subject: `A new API key has been created for you on Relater`,
      react: apiKeyCreated({
        email: session.user.email,
        token: {
          name,
          type: 'All access',
          permissions: 'full access to all resources',
        },
      }),
    })
  );

  return NextResponse.json({ token });
});
