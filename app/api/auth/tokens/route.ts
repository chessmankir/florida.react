import { NextRequest, NextResponse } from "next/server";
import { AUTH_ACCOUNT_COOKIE, AUTH_SESSION_COOKIE } from "@/lib/auth-session";

export async function GET(request: NextRequest) {
  const sessionToken = request.cookies.get(AUTH_SESSION_COOKIE)?.value;
  const accountId = request.cookies.get(AUTH_ACCOUNT_COOKIE)?.value;
  if (!sessionToken || !accountId) return NextResponse.json({ message: "Требуется авторизация" }, { status: 401 });

  const apiBaseUrl = process.env.ANALYTICS_API_URL ?? "http://127.0.0.1:3025";
  try {
    const upstreamUrl = new URL("/auth/tokens", apiBaseUrl);
    upstreamUrl.searchParams.set("accountId", accountId);
    const response = await fetch(upstreamUrl, {
      headers: { authorization: `Bearer ${sessionToken}` },
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
    return new NextResponse(await response.text(), {
      status: response.status,
      headers: { "content-type": response.headers.get("content-type") ?? "application/json" },
    });
  } catch {
    return NextResponse.json({ message: "Сервис аккаунта недоступен" }, { status: 502 });
  }
}

export async function PATCH(request: NextRequest) {
  const sessionToken = request.cookies.get(AUTH_SESSION_COOKIE)?.value;
  if (!sessionToken) return NextResponse.json({ message: "Требуется авторизация" }, { status: 401 });

  const apiBaseUrl = process.env.ANALYTICS_API_URL ?? "http://127.0.0.1:3025";
  try {
    const response = await fetch(new URL("/auth/tokens", apiBaseUrl), {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${sessionToken}`,
      },
      body: await request.text(),
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
    return new NextResponse(await response.text(), {
      status: response.status,
      headers: { "content-type": response.headers.get("content-type") ?? "application/json" },
    });
  } catch {
    return NextResponse.json({ message: "Сервис аккаунта недоступен" }, { status: 502 });
  }
}
