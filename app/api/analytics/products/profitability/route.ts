import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const apiBaseUrl = process.env.ANALYTICS_API_URL ?? "http://127.0.0.1:3017";
  const upstreamUrl = new URL("/analytics/products/profitability", apiBaseUrl);
  request.nextUrl.searchParams.forEach((value, key) => upstreamUrl.searchParams.set(key, value));

  try {
    const response = await fetch(upstreamUrl, { cache: "no-store", signal: AbortSignal.timeout(15_000) });
    const body = await response.text();
    return new NextResponse(body, { status: response.status, headers: { "content-type": response.headers.get("content-type") ?? "application/json" } });
  } catch {
    return NextResponse.json({ message: "Analytics API is unavailable" }, { status: 502 });
  }
}
