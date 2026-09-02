import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get("auth_session");
  const isLoginPage = request.nextUrl.pathname.startsWith("/login");

  // If there is no cookie and the user is NOT on the login page, redirect them to login
  if (!authCookie && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If they are already logged in and try to visit the login page, redirect to home
  if (authCookie && isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Apply this lock to the homepage and the class upload API
  matcher: ["/", "/api/upload-class"],
};