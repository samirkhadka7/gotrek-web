import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("authToken")?.value;
  const currentUser = request.cookies.get("currentUser")?.value;
  const { pathname } = request.nextUrl;

  // No token — redirect to login for protected routes
  if (!token || !currentUser) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Parse role from the currentUser cookie
  let role: string | undefined;
  try {
    const user = JSON.parse(currentUser) as { role?: string };
    role = user.role;
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // /admin/* — must be logged in AND have admin role
  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
};
