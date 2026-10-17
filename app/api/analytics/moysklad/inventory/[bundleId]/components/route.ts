import { NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest, context: { params: Promise<{ bundleId: string }> }) {
  const { bundleId } = await context.params;
  const apiBaseUrl = process.env.ANALYTICS_API_URL ?? "http://127.0.0.1:3025";
  const upstreamUrl = new URL(`/analytics/moysklad/inventory/${encodeURIComponent(bundleId)}/components`, apiBaseUrl);
  try {
    const response = await fetch(upstreamUrl, { cache: "no-store", signal: AbortSignal.timeout(15_000) });
    return new NextResponse(await response.text(), { status: response.status, headers: { "content-type": response.headers.get("content-type") ?? "application/json" } });
  } catch {
    return NextResponse.json({ message: "MoySklad bundle API is unavailable" }, { status: 502 });
  }
}
