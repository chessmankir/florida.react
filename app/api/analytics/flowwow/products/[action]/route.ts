import { NextRequest, NextResponse } from "next/server";

type Context = { params: Promise<{ action: string }> };

export async function POST(request: NextRequest, context: Context) {
  const { action } = await context.params;
  if (action !== "hide" && action !== "unhide") {
    return NextResponse.json({ message: "Unsupported Flowwow product action" }, { status: 404 });
  }

  const apiBaseUrl = process.env.ANALYTICS_API_URL ?? "http://127.0.0.1:3017";
  const upstreamUrl = new URL(`/analytics/flowwow/products/${action}`, apiBaseUrl);
  request.nextUrl.searchParams.forEach((value, key) => upstreamUrl.searchParams.set(key, value));

  try {
    const response = await fetch(upstreamUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: await request.text(),
      signal: AbortSignal.timeout(20_000),
    });
    const body = await response.text();
    return new NextResponse(body, {
      status: response.status,
      headers: { "content-type": response.headers.get("content-type") ?? "application/json" },
    });
  } catch {
    return NextResponse.json({ message: "Flowwow products API is unavailable" }, { status: 502 });
  }
}
