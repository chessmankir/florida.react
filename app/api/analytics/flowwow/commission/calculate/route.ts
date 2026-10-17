import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const apiBaseUrl = process.env.ANALYTICS_API_URL ?? "http://127.0.0.1:3025";
  const upstreamUrl = new URL("/analytics/flowwow/commission/calculate", apiBaseUrl);
  try {
    const response = await fetch(upstreamUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: await request.text(),
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
    return new NextResponse(await response.text(), { status: response.status, headers: { "content-type": response.headers.get("content-type") ?? "application/json" } });
  } catch {
    return NextResponse.json({ message: "Flowwow commission API is unavailable" }, { status: 502 });
  }
}
