import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { flowwowImageDirectory, safeFlowwowImageName } from "@/lib/flowwow-image-storage";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ name: string }> }) {
  const { name: requestedName } = await context.params;
  const name = safeFlowwowImageName(requestedName);
  if (!name) return new NextResponse("Not found", { status: 404 });

  const candidates = [
    path.join(flowwowImageDirectory(), name),
    path.join(process.cwd(), "public", "uploads", "flowwow", name),
  ];

  for (const filePath of candidates) {
    try {
      const image = await readFile(/* turbopackIgnore: true */ filePath);
      return new NextResponse(image, {
        headers: {
          "Content-Type": "image/jpeg",
          "Content-Length": String(image.byteLength),
          "Cache-Control": "public, max-age=31536000, immutable",
          "X-Content-Type-Options": "nosniff",
        },
      });
    } catch (error) {
      const code = error && typeof error === "object" && "code" in error ? String(error.code) : "";
      if (code !== "ENOENT") throw error;
    }
  }

  return new NextResponse("Not found", { status: 404 });
}
