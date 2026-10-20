"use client";

import { FormEvent, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden="true">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4.5 20c.7-4 3.3-6 7.5-6s6.8 2 7.5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function message(payload: unknown, fallback: string) {
  if (!payload || typeof payload !== "object" || !("message" in payload)) return fallback;
  const value = (payload as { message?: unknown }).message;
  return typeof value === "string" ? value : fallback;
}

export function AccountMenu({ variant = "default" }: { variant?: "default" | "sidebar" }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [flowwowToken, setFlowwowToken] = useState("");
  const [moyskladToken, setMoyskladToken] = useState("");
  const [pending, setPending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", close);
    const controller = new AbortController();
    setLoading(true);
    fetch("/api/auth/tokens", { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        const payload = await response.json().catch(() => null) as { flowwowToken?: string | null; moyskladToken?: string | null } | null;
        if (!response.ok) throw new Error(message(payload, "Не удалось загрузить токены"));
        setFlowwowToken(payload?.flowwowToken ?? "");
        setMoyskladToken(payload?.moyskladToken ?? "");
      })
      .catch((loadError) => {
        if (loadError instanceof DOMException && loadError.name === "AbortError") return;
        setError(loadError instanceof Error ? loadError.message : "Не удалось загрузить токены");
      })
      .finally(() => setLoading(false));
    return () => {
      controller.abort();
      window.removeEventListener("keydown", close);
    };
  }, [open]);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSaved(false);
    setPending(true);
    try {
      const response = await fetch("/api/auth/tokens", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ flowwowToken, moyskladToken }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) throw new Error(message(payload, "Не удалось сохранить токены"));
      setSaved(true);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Не удалось сохранить токены");
    } finally {
      setPending(false);
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <>
      <button type="button" onClick={() => { setOpen(true); setError(null); setSaved(false); }} aria-label="Открыть настройки аккаунта" className={`grid size-10 shrink-0 place-items-center rounded-full border shadow-sm transition ${variant === "sidebar" ? "border-slate-700 bg-slate-900 text-slate-200 hover:border-emerald-400 hover:text-emerald-400" : "border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:text-emerald-700 hover:shadow-md"}`}>
        <UserIcon />
      </button>

      {open && createPortal((
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 px-4 py-8" onMouseDown={(event) => event.target === event.currentTarget && setOpen(false)}>
          <section role="dialog" aria-modal="true" aria-labelledby="account-dialog-title" className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 id="account-dialog-title" className="text-2xl font-bold text-slate-950">Настройки аккаунта</h2>
                <p className="mt-1 text-sm text-slate-500">Добавьте токены для подключения сервисов</p>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Закрыть" className="grid size-9 place-items-center rounded-full text-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700">×</button>
            </div>

            <form className="space-y-5" onSubmit={save}>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">Токен Flowwow</span>
                <textarea value={flowwowToken} onChange={(event) => setFlowwowToken(event.target.value)} rows={3} autoComplete="off" disabled={loading} placeholder={loading ? "Загрузка…" : "Вставьте токен Flowwow"} className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:bg-slate-50" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">Токен МойСклад</span>
                <textarea value={moyskladToken} onChange={(event) => setMoyskladToken(event.target.value)} rows={3} autoComplete="off" disabled={loading} placeholder={loading ? "Загрузка…" : "Вставьте токен МойСклад"} className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 disabled:bg-slate-50" />
              </label>

              <p className="text-xs text-slate-400">Пустое поле не изменяет уже сохранённый токен.</p>
              {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
              {saved && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">Токены сохранены</div>}

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-between">
                <button type="button" onClick={logout} className="h-11 rounded-xl px-4 text-sm font-medium text-red-600 hover:bg-red-50">Выйти из аккаунта</button>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setOpen(false)} className="h-11 flex-1 rounded-xl border border-slate-200 px-5 text-sm font-medium text-slate-600 hover:bg-slate-50 sm:flex-none">Отмена</button>
                  <button type="submit" disabled={loading || pending || (!flowwowToken.trim() && !moyskladToken.trim())} className="h-11 flex-1 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none">{pending ? "Сохранение…" : "Сохранить"}</button>
                </div>
              </div>
            </form>
          </section>
        </div>
      ), document.body)}
    </>
  );
}
