import { PrismaAdapter } from '@auth/prisma-adapter';
import { httpAdapterRouteHandlers } from "@repo/auth-js-http-adapter";
import prisma from '@repo/database';

export const { POST } = httpAdapterRouteHandlers({ adapter: PrismaAdapter(prisma) });

