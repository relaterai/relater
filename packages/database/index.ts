import 'server-only';

import { PrismaClient } from '@prisma/client';
import { keys } from './keys';

const { DATABASE_DIRECT_URL } = keys();

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasourceUrl: DATABASE_DIRECT_URL,
    log:
      process.env.NODE_ENV === 'production'
        ? []
        : ['query', 'info', 'warn', 'error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma;

export * from '@prisma/client';