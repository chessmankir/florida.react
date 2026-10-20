import { NextRequest, NextResponse } from "next/server";
import { backendAccountHeaders } from "@/lib/backend-account";
export async function POST(request: NextRequest) {
  const url = new URL("/analytics/flowwow/products/create", process.env.ANALYTICS_API_URL ?? "http://127.0.0.1:3025");
  request.nextUrl.searchParams.forEach((value, key) => url.searchParams.set(key, value));
  try { const response = await fetch(url, { method: "POST", headers: backendAccountHeaders(request, { "content-type": "application/json" }), body: await request.text(), cache: "no-store", signal: AbortSignal.timeout(30000) }); return new NextResponse(await response.text(), { status: response.status, headers: { "content-type": response.headers.get("content-type") ?? "application/json" } }); }
  catch { return NextResponse.json({ message: "Flowwow create product API is unavailable" }, { status: 502 }); }
}
