import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { AUTH_SESSION_COOKIE } from "@/lib/auth-session";

const extensions: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
export async function POST(request: NextRequest) {
  if (!request.cookies.get(AUTH_SESSION_COOKIE)?.value) return NextResponse.json({ message: "Требуется авторизация" }, { status: 401 });
  const form = await request.formData(); const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ message: "Файл не передан" }, { status: 400 });
  const extension = extensions[file.type];
  if (!extension) return NextResponse.json({ message: "Поддерживаются JPG, PNG и WebP" }, { status: 400 });
  if (file.size > 12 * 1024 * 1024) return NextResponse.json({ message: "Размер изображения не должен превышать 12 МБ" }, { status: 400 });
  const name = `${randomUUID()}.${extension}`; const directory = path.join(process.cwd(), "public", "uploads", "flowwow");
  await mkdir(directory, { recursive: true }); await writeFile(path.join(directory, name), Buffer.from(await file.arrayBuffer()));
  const publicBaseUrl = (process.env.PUBLIC_APP_URL || request.nextUrl.origin).replace(/\/$/, "");
  return NextResponse.json({ url: `${publicBaseUrl}/uploads/flowwow/${name}` });
}
