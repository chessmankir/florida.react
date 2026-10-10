"use client";

import { useState } from "react";

type Props = {
  onSynced: () => Promise<void>;
};

export function FlowwowProductsSyncButton({ onSynced }: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function synchronize() {
    setStatus("loading");
    setMessage(null);
    try {
      const response = await fetch("/api/synchronization/run?scope=flowwow_products", { method: "POST" });
      const payload = await response.json().catch(() => null) as { message?: string; errors?: string[] } | null;
      if (!response.ok) throw new Error(payload?.message || `API вернул ошибку ${response.status}`);
      if (payload?.errors?.length) throw new Error(payload.errors.join(" "));
      await onSynced();
      setStatus("success");
      setMessage("Товары синхронизированы");
    } catch (reason) {
      setStatus("error");
      setMessage(reason instanceof Error ? reason.message : "Не удалось синхронизировать товары");
    }
  }

  return (
    <button
      type="button"
      disabled={status === "loading"}
      title={message ?? "Получить актуальные товары из Flowwow"}
      className={`flex h-10 items-center gap-2 rounded-xl border bg-white px-4 text-sm font-semibold shadow-sm transition disabled:cursor-wait disabled:opacity-60 ${
        status === "success"
          ? "border-emerald-300 text-emerald-700"
          : status === "error"
            ? "border-red-300 text-red-700"
            : "border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
      }`}
      onClick={synchronize}
    >
      <svg className={`size-4 ${status === "loading" ? "animate-spin" : ""}`} viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M16.5 6.5V3m0 0H13m3.5 0-2.1 2.1A6.5 6.5 0 1 0 16 12.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {status === "loading" ? "Синхронизация…" : status === "success" ? "Синхронизировано" : "Синхронизировать товары"}
    </button>
  );
}
