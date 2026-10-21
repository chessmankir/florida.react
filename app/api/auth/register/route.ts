import { NextRequest, NextResponse } from "next/server";
import { saveAuthSession } from "@/lib/auth-session";

export async function POST(request: NextRequest) {
  const apiBaseUrl = process.env.ANALYTICS_API_URL ?? "http://127.0.0.1:3025";

  try {
    const response = await fetch(new URL("/auth/register", apiBaseUrl), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: await request.text(),
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
    const body = await response.text();
    if (!response.ok) {
      return new NextResponse(body, {
        status: response.status,
        headers: { "content-type": response.headers.get("content-type") ?? "application/json" },
      });
    }

    const account = JSON.parse(body) as { accountId?: string; email?: string; sessionToken?: string };
    if (!account.accountId || !account.email || !account.sessionToken) {
      return NextResponse.json({ message: "Сервер вернул некорректные данные аккаунта" }, { status: 502 });
    }
    const result = NextResponse.json(account);
    saveAuthSession(request, result, account.accountId, account.email, account.sessionToken);
    return result;
  } catch {
    return NextResponse.json({ message: "Сервис регистрации недоступен" }, { status: 502 });
  }
}
