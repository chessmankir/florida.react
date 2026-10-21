import { NextRequest, NextResponse } from "next/server";
import { clearAuthSession } from "@/lib/auth-session";

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true });
  clearAuthSession(request, response);
  return response;
}
