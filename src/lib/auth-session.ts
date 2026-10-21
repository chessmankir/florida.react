import { NextRequest, NextResponse } from "next/server";

export const AUTH_ACCOUNT_COOKIE = "florida_account_id";
export const AUTH_EMAIL_COOKIE = "florida_account_email";
export const AUTH_SESSION_COOKIE = "florida_session";

function cookieOptions(request: NextRequest) {
  const forwardedProtocol = request.headers.get("x-forwarded-proto")
    ?.split(",", 1)[0]
    ?.trim()
    .toLowerCase();

  return {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
    sameSite: "lax" as const,
    secure: request.nextUrl.protocol === "https:" || forwardedProtocol === "https",
  };
}

export function saveAuthSession(request: NextRequest, response: NextResponse, accountId: string, email: string, sessionToken: string) {
  const options = cookieOptions(request);
  response.cookies.set(AUTH_ACCOUNT_COOKIE, accountId, options);
  response.cookies.set(AUTH_EMAIL_COOKIE, email, options);
  response.cookies.set(AUTH_SESSION_COOKIE, sessionToken, options);
}

export function clearAuthSession(request: NextRequest, response: NextResponse) {
  const options = cookieOptions(request);
  response.cookies.set(AUTH_ACCOUNT_COOKIE, "", { ...options, maxAge: 0 });
  response.cookies.set(AUTH_EMAIL_COOKIE, "", { ...options, maxAge: 0 });
  response.cookies.set(AUTH_SESSION_COOKIE, "", { ...options, maxAge: 0 });
}
