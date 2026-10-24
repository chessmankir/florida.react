import path from "node:path";

export function flowwowImageDirectory(): string {
  return process.env.FLOWWOW_UPLOAD_DIR || path.join(process.cwd(), "storage", "flowwow");
}

export function safeFlowwowImageName(value: string): string | null {
  return /^[0-9a-f-]{36}\.jpg$/i.test(value) ? value : null;
}
