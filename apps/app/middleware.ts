import { auth } from '@repo/auth/middleware';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const protectedRoutes = ['/api/user'];

export default async function middleware(request: NextRequest) {
  const session = await auth();

  const isProtected = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (!session && isProtected) {
    const absoluteUrl = new URL('/sign-in', request.nextUrl.origin);
    return NextResponse.redirect(absoluteUrl.toString());
  }

  return NextResponse.next();
}
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api)(.*)',
  ],
};
