import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const apiBaseUrl = process.env.ANALYTICS_API_URL ?? "http://127.0.0.1:3025";
  const upstreamUrl = new URL("/synchronization/run", apiBaseUrl);
  request.nextUrl.searchParams.forEach((value, key) => upstreamUrl.searchParams.set(key, value));

  try {
    const response = await fetch(upstreamUrl, {
      method: "POST",
      signal: AbortSignal.timeout(10 * 60_000),
    });
    const body = await response.text();
    return new NextResponse(body, {
      status: response.status,
      headers: { "content-type": response.headers.get("content-type") ?? "application/json" },
    });
  } catch {
    return NextResponse.json({ message: "Synchronization API is unavailable" }, { status: 502 });
  }
}
