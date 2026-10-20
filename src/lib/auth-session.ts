import { NextResponse } from "next/server";

export const AUTH_ACCOUNT_COOKIE = "florida_account_id";
export const AUTH_EMAIL_COOKIE = "florida_account_email";
export const AUTH_SESSION_COOKIE = "florida_session";

const cookieOptions = {
  httpOnly: true,
  maxAge: 60 * 60 * 24 * 30,
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};

export function saveAuthSession(response: NextResponse, accountId: string, email: string, sessionToken: string) {
  response.cookies.set(AUTH_ACCOUNT_COOKIE, accountId, cookieOptions);
  response.cookies.set(AUTH_EMAIL_COOKIE, email, cookieOptions);
  response.cookies.set(AUTH_SESSION_COOKIE, sessionToken, cookieOptions);
}

export function clearAuthSession(response: NextResponse) {
  response.cookies.set(AUTH_ACCOUNT_COOKIE, "", { ...cookieOptions, maxAge: 0 });
  response.cookies.set(AUTH_EMAIL_COOKIE, "", { ...cookieOptions, maxAge: 0 });
  response.cookies.set(AUTH_SESSION_COOKIE, "", { ...cookieOptions, maxAge: 0 });
}
