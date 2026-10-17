import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const apiBaseUrl = process.env.ANALYTICS_API_URL ?? "http://127.0.0.1:3025";
  const upstreamUrl = new URL("/analytics/flowwow/orders/import", apiBaseUrl);
  const shopId = request.nextUrl.searchParams.get("shopId");
  if (shopId) upstreamUrl.searchParams.set("shopId", shopId);

  try {
    const formData = await request.formData();
    const response = await fetch(upstreamUrl, {
      method: "POST",
      body: formData,
      signal: AbortSignal.timeout(60_000),
    });
    const body = await response.text();
    return new NextResponse(body, {
      status: response.status,
      headers: { "content-type": response.headers.get("content-type") ?? "application/json" },
    });
  } catch {
    return NextResponse.json({ message: "Flowwow import API is unavailable" }, { status: 502 });
  }
}
