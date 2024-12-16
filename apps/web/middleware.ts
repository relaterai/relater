// import { authMiddleware } from '@repo/auth/middleware';
import { NextResponse } from 'next/server';

export const config = {
  // matcher tells Next.js which routes to run the middleware on. This runs the
  // middleware on all routes except for static assets and Posthog ingest
  // matcher: ['/((?!_next/static|_next/image|ingest|favicon.ico).*)'],
};

export default async () => {
  // const decision = await aj.protect(request);

  // if (
  //   // If this deny comes from a bot rule then block the request. You can
  //   // customize this logic to fit your needs e.g. changing the status code.
  //   decision.isDenied() &&
  //   decision.reason.isBot()
  // ) {
  //   return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  // }

  return NextResponse.next();
};
