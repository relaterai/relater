import { hashToken } from '@repo/auth/hash-token';
import prisma from '@repo/database';
import { nanoid } from '@repo/utils';

async function main() {
  const token = nanoid(24);
  console.log({ token });
  const user = await prisma.user.upsert({
    where: {
      id: 'cm5ant50d0000180q277dpbd0',
    },
    update: {},
    create: {
      email: 'test@relater.ai',
    },
  });
  const hashedKey = await hashToken(token);
  // take first 3 and last 4 characters of the key
  const partialKey = `${token.slice(0, 3)}...${token.slice(-4)}`;
  const existingToken = await prisma.token.findFirst({
    where: {
      userId: user.id,
    },
  });
  if (existingToken) {
    console.log('Token already exists');
    return existingToken;
  } else {
    return await prisma.token.create({
      data: {
        name: 'E2E Test Key',
        hashedKey,
        partialKey,
        userId: user.id,
      },
    });
  }
}

main();
