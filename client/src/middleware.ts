import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Token is stored in localStorage (client-side only)
  // We can't check localStorage in middleware, so we skip auth check here
  // Auth guard is handled in (main)/layout.tsx and (admin)/layout.tsx client-side
  const { pathname } = request.nextUrl;

  // Just pass through all requests - client-side auth guards handle protection
  return NextResponse.next();
}

export const config = { matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'] };
// TODO: add rate limiting for auth routes
