import { PrismaClient } from '@prisma/client';
import { env } from '@repo/env';

const prisma = new PrismaClient({
  datasourceUrl: env.DATABASE_URL,
}) as PrismaClient;

export default prisma;

export * from '@prisma/client/edge';
