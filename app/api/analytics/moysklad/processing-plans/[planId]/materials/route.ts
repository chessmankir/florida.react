import { NextRequest, NextResponse } from "next/server";
import { backendAccountHeaders } from "@/lib/backend-account";
export async function GET(request: NextRequest, context: { params: Promise<{ planId: string }> }) {
  const { planId } = await context.params;
  const url = new URL(`/analytics/moysklad/processing-plans/${encodeURIComponent(planId)}/materials`, process.env.ANALYTICS_API_URL ?? "http://127.0.0.1:3025");
  try { const response = await fetch(url, { headers: backendAccountHeaders(request), cache: "no-store", signal: AbortSignal.timeout(15000) }); return new NextResponse(await response.text(), { status: response.status, headers: { "content-type": response.headers.get("content-type") ?? "application/json" } }); }
  catch { return NextResponse.json({ message: "MoySklad processing plan materials API is unavailable" }, { status: 502 }); }
}
