import { NextRequest, NextResponse } from "next/server";
import { AUTH_ACCOUNT_COOKIE, AUTH_EMAIL_COOKIE, AUTH_SESSION_COOKIE } from "@/lib/auth-session";

const publicPages = new Set(["/login", "/register"]);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authenticated = Boolean(
    request.cookies.get(AUTH_ACCOUNT_COOKIE)?.value
    && request.cookies.get(AUTH_EMAIL_COOKIE)?.value
    && request.cookies.get(AUTH_SESSION_COOKIE)?.value,
  );

  if (publicPages.has(pathname)) {
    if (authenticated) return NextResponse.redirect(new URL("/analytics/flowwow/products", request.url));
    return NextResponse.next();
  }

  if (!authenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
