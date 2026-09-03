import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get("auth_session");
  const { pathname } = request.nextUrl;

  // 1. Allow public access to the login page and the login API
  if (pathname.startsWith("/login") || pathname.startsWith("/api/login")) {
    // If they already have a cookie and try to visit /login, bounce them to Dashboard
    if (authCookie && pathname === "/login") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // 2. If there is NO cookie, deny access completely
  if (!authCookie) {
    // If someone tries to access raw data via API, send a 401 Unauthorized error
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // If they try to access a page like /clubs or /, redirect to the login screen
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 3. If they have a cookie and are not on the login page, let them through
  return NextResponse.next();
}

export const config = {
  // Apply this lock to ALL routes except background Next.js files
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};