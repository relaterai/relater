import { withSession } from '@repo/auth/session';

export const GET = withSession(async ({ req, session }) => {
  return Response.json({
    message: 'Protected data',
    user: session.user,
  });
}) as any;
