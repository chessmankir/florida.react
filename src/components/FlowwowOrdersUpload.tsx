"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";

export function FlowwowOrdersUpload({ shopId, shopName, onUploaded }: { shopId: string; shopName: string; onUploaded: () => Promise<void> }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");

  useEffect(() => setStatus("idle"), [shopId]);

  async function uploadFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const selectedShopId = shopId;

    setStatus("uploading");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`/api/analytics/flowwow/orders/import?shopId=${encodeURIComponent(selectedShopId)}`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error(`API вернул ошибку ${response.status}`);
      await onUploaded();
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      event.target.value = "";
    }
  }

  const title = status === "success"
    ? `Файл загружен для магазина ${shopName}`
    : status === "error"
      ? "Не удалось загрузить файл"
      : `Загрузить заказы из XLS для магазина ${shopName}`;

  return (
    <>
      <input
        ref={inputRef}
        className="sr-only"
        type="file"
        accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        onChange={uploadFile}
      />
      <button
        type="button"
        title={title}
        disabled={status === "uploading" || !shopId}
        className={`flex h-9 items-center gap-2 rounded-lg border bg-white px-3 text-xs font-semibold shadow-sm transition disabled:cursor-wait disabled:opacity-60 ${
          status === "success"
            ? "border-emerald-300 text-emerald-700"
            : status === "error"
              ? "border-red-300 text-red-700"
              : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
        }`}
        onClick={() => inputRef.current?.click()}
      >
        <svg className="size-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 3.75h9l5 5v11.5H5V3.75Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M14 3.75v5h5M8 12l4 5m0-5-4 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {status === "uploading" ? "Загрузка…" : status === "success" ? "Загружено" : "Загрузить XLS"}
      </button>
    </>
  );
}
