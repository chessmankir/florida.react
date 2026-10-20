import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const apiBaseUrl = process.env.ANALYTICS_API_URL ?? "http://127.0.0.1:3025";
  const upstreamUrl = new URL("/auth/registered", apiBaseUrl);
  const email = request.nextUrl.searchParams.get("email");
  if (email) upstreamUrl.searchParams.set("email", email);

  try {
    const response = await fetch(upstreamUrl, { cache: "no-store", signal: AbortSignal.timeout(15_000) });
    return new NextResponse(await response.text(), {
      status: response.status,
      headers: { "content-type": response.headers.get("content-type") ?? "application/json" },
    });
  } catch {
    return NextResponse.json({ message: "Сервис регистрации недоступен" }, { status: 502 });
  }
}
