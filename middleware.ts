import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get("auth_session");
  const { pathname } = request.nextUrl;

  // 1. Allow public access to the login page ("/") and the login API
  if (pathname === "/" || pathname.startsWith("/api/login")) {
    // If they already have a cookie and try to visit the login page, bounce them to Dashboard
    if (authCookie && pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // 2. If there is NO cookie, deny access completely
  if (!authCookie) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Redirect unauthorized users back to the root login page
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 3. If they have a cookie and are on a protected page, let them through
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};