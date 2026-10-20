import type { NextRequest } from "next/server";

import { AUTH_ACCOUNT_COOKIE, AUTH_SESSION_COOKIE } from "./auth-session";

export function backendAccountHeaders(
  request: NextRequest,
  headers: HeadersInit = {},
): Headers {
  const result = new Headers(headers);
  const accountId = request.cookies.get(AUTH_ACCOUNT_COOKIE)?.value;
  const sessionToken = request.cookies.get(AUTH_SESSION_COOKIE)?.value;

  if (accountId) result.set("x-account-id", accountId);
  if (sessionToken) result.set("authorization", `Bearer ${sessionToken}`);

  return result;
}
