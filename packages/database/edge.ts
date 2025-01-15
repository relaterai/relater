import { PrismaClient } from '@prisma/client/edge';
import { keys } from './keys';

const { DATABASE_URL } = keys();

const prismaClientSingleton = () => {
  return new PrismaClient({
    datasourceUrl: DATABASE_URL,
    log:
      process.env.NODE_ENV === 'production'
        ? []
        : ['query', 'info', 'warn', 'error'],
  });
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;

export * from '@prisma/client/edge';
