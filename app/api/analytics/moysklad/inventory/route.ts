import { NextRequest, NextResponse } from "next/server";
import { backendAccountHeaders } from "@/lib/backend-account";

export async function GET(request: NextRequest) {
  const apiBaseUrl = process.env.ANALYTICS_API_URL ?? "http://127.0.0.1:3025";
  const upstreamUrl = new URL("/analytics/moysklad/inventory", apiBaseUrl);
  request.nextUrl.searchParams.forEach((value, key) => upstreamUrl.searchParams.set(key, value));
  try {
    const response = await fetch(upstreamUrl, { headers: backendAccountHeaders(request), cache: "no-store", signal: AbortSignal.timeout(15_000) });
    return new NextResponse(await response.text(), { status: response.status, headers: { "content-type": response.headers.get("content-type") ?? "application/json" } });
  } catch {
    return NextResponse.json({ message: "MoySklad inventory API is unavailable" }, { status: 502 });
  }
}
