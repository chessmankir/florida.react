import { NextRequest, NextResponse } from "next/server";
import { backendAccountHeaders } from "@/lib/backend-account";

const apiBaseUrl = process.env.ANALYTICS_API_URL ?? "http://127.0.0.1:3025";

export async function GET(request: NextRequest) {
  const upstreamUrl = new URL("/analytics/flowwow/products/links", apiBaseUrl);
  request.nextUrl.searchParams.forEach((value, key) => upstreamUrl.searchParams.set(key, value));
  return forward(request, upstreamUrl, { method: "GET" });
}

export async function POST(request: NextRequest) {
  return forward(request, new URL("/analytics/flowwow/products/links", apiBaseUrl), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: await request.text(),
  });
}

export async function DELETE(request: NextRequest) {
  const upstreamUrl = new URL("/analytics/flowwow/products/links", apiBaseUrl);
  request.nextUrl.searchParams.forEach((value, key) => upstreamUrl.searchParams.set(key, value));
  return forward(request, upstreamUrl, { method: "DELETE" });
}

async function forward(request: NextRequest, url: URL, init: RequestInit) {
  try {
    const response = await fetch(url, { ...init, headers: backendAccountHeaders(request, init.headers), cache: "no-store", signal: AbortSignal.timeout(15_000) });
    return new NextResponse(await response.text(), { status: response.status, headers: { "content-type": response.headers.get("content-type") ?? "application/json" } });
  } catch {
    return NextResponse.json({ message: "Flowwow product links API is unavailable" }, { status: 502 });
  }
}
