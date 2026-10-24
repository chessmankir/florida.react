import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { AUTH_SESSION_COOKIE } from "@/lib/auth-session";

const acceptedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
export async function POST(request: NextRequest) {
  if (!request.cookies.get(AUTH_SESSION_COOKIE)?.value) return NextResponse.json({ message: "Требуется авторизация" }, { status: 401 });
  const form = await request.formData(); const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ message: "Файл не передан" }, { status: 400 });
  if (!acceptedTypes.has(file.type)) return NextResponse.json({ message: "Поддерживаются JPG, PNG и WebP" }, { status: 400 });
  if (file.size > 10 * 1024 * 1024) return NextResponse.json({ message: "Размер изображения не должен превышать 10 МБ" }, { status: 400 });
  const name = `${randomUUID()}.jpg`; const directory = path.join(process.cwd(), "public", "uploads", "flowwow");
  const image = await sharp(Buffer.from(await file.arrayBuffer()))
    .rotate()
    .resize(1200, 1200, { fit: "cover", position: "centre" })
    .flatten({ background: "#ffffff" })
    .jpeg({ quality: 90, chromaSubsampling: "4:4:4" })
    .toBuffer();
  await mkdir(directory, { recursive: true }); await writeFile(path.join(directory, name), image);
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwardedHost || request.headers.get("host")?.split(",")[0]?.trim();
  const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const protocol = forwardedProto || (host && !/^(localhost|127\.0\.0\.1)(:|$)/i.test(host) ? "https" : request.nextUrl.protocol.replace(":", ""));
  const publicBaseUrl = (process.env.PUBLIC_APP_URL || (host ? `${protocol}://${host}` : request.nextUrl.origin)).replace(/\/$/, "");
  if (/localhost|127\.0\.0\.1/i.test(publicBaseUrl)) {
    return NextResponse.json({ message: "На сервере не настроен публичный адрес приложения (PUBLIC_APP_URL)" }, { status: 500 });
  }
  return NextResponse.json({ url: `${publicBaseUrl}/uploads/flowwow/${name}` });
}
