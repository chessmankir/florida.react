"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ProductsTabs } from "@/components/ProductsTabs";

type InventoryItem = {
  id: string; name: string; code: string | null; article: string | null;
  uomName: string | null; stock: number; reserve: number; available: number; inTransit: number;
};
type ResponseData = { items: InventoryItem[]; pagination: { page: number; limit: number; total: number; totalPages: number } };
const number = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 2 });

function positive(value: string | null, fallback: number) {
  const parsed = Number(value); return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export function ProductsInventory() {
  const router = useRouter(); const pathname = usePathname(); const params = useSearchParams();
  const [isNavigating, startTransition] = useTransition();
  const [data, setData] = useState<ResponseData | null>(null);
  const [error, setError] = useState<string | null>(null); const [loading, setLoading] = useState(true);
  const query = useMemo(() => ({
    search: params.get("search")?.trim() ?? "",
    sortBy: params.get("sortBy") === "stock" ? "stock" : "available",
    sortDirection: params.get("sortDirection") === "asc" ? "asc" : "desc",
    page: positive(params.get("page"), 1), limit: [10, 25, 50, 100].includes(positive(params.get("limit"), 50)) ? positive(params.get("limit"), 50) : 50,
  }), [params]);

  useEffect(() => {
    const controller = new AbortController(); setLoading(true); setError(null);
    const search = new URLSearchParams({ archived: "false", sortBy: query.sortBy, sortDirection: query.sortDirection, page: String(query.page), limit: String(query.limit) });
    if (query.search) search.set("search", query.search);
    fetch(`/api/analytics/moysklad/inventory?${search}`, { cache: "no-store", signal: controller.signal })
      .then(async (response) => { if (!response.ok) throw new Error(`API вернул ошибку ${response.status}`); return response.json(); })
      .then((result) => setData({
        items: (result.items ?? []).map((item: Record<string, unknown>) => ({ id: String(item.id), name: String(item.name ?? "Без названия"), code: item.code ? String(item.code) : null, article: item.article ? String(item.article) : null, uomName: item.uomName ? String(item.uomName) : null, stock: Number(item.stock ?? 0), reserve: Number(item.reserve ?? 0), available: Number(item.available ?? 0), inTransit: Number(item.inTransit ?? 0) })),
        pagination: { page: Number(result.pagination?.page ?? 1), limit: Number(result.pagination?.limit ?? 50), total: Number(result.pagination?.total ?? 0), totalPages: Number(result.pagination?.totalPages ?? 0) },
      })).catch((reason) => { if (reason?.name !== "AbortError") setError(reason instanceof Error ? reason.message : "Не удалось загрузить остатки"); }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [query]);

  function update(patch: Partial<typeof query>) {
    const next = { ...query, ...patch }; const nextParams = new URLSearchParams();
    if (next.search) nextParams.set("search", next.search);
    nextParams.set("sortBy", next.sortBy); nextParams.set("sortDirection", next.sortDirection); nextParams.set("page", String(next.page)); nextParams.set("limit", String(next.limit));
    startTransition(() => router.replace(`${pathname}?${nextParams}`, { scroll: false }));
  }
  const pending = loading || isNavigating;
  return <section className="relative mx-auto max-w-[1500px]">
    <ProductsTabs />
    <div className="mb-7"><p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">Продажи и товары</p><h1 className="text-3xl font-bold tracking-tight text-slate-950">Остатки товаров</h1><p className="mt-2 text-sm text-slate-500">Актуальное количество товаров по данным МойСклад</p></div>
    <div className="mb-4 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[minmax(260px,1fr)_210px_190px]">
      <label className="grid gap-1.5 text-xs font-semibold text-slate-500">Поиск товара<input type="search" defaultValue={query.search} placeholder="Название, код или артикул" className="h-11 rounded-xl border border-slate-200 px-3 text-sm text-slate-900 outline-none focus:border-emerald-500" onKeyDown={(event) => { if (event.key === "Enter") update({ search: event.currentTarget.value.trim(), page: 1 }); }} /></label>
      <label className="grid gap-1.5 text-xs font-semibold text-slate-500">Сортировать по<select value={query.sortBy} disabled={pending} className="h-11 rounded-xl border border-slate-200 px-3 text-sm text-slate-900" onChange={(event) => update({ sortBy: event.target.value as "available" | "stock", page: 1 })}><option value="available">Доступно</option><option value="stock">Остаток</option></select></label>
      <label className="grid gap-1.5 text-xs font-semibold text-slate-500">Направление<select value={query.sortDirection} disabled={pending} className="h-11 rounded-xl border border-slate-200 px-3 text-sm text-slate-900" onChange={(event) => update({ sortDirection: event.target.value as "asc" | "desc", page: 1 })}><option value="desc">От большего к меньшему</option><option value="asc">От меньшего к большему</option></select></label>
    </div>
    {error ? <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error}</div> : <div className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ${pending ? "opacity-60" : ""}`}><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-sm"><thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-5 py-3.5 text-left">Товар</th><th className="px-5 py-3.5 text-left">Код / артикул</th><th className="px-5 py-3.5 text-right">Остаток</th><th className="px-5 py-3.5 text-right">Резерв</th><th className="px-5 py-3.5 text-right">Доступно</th><th className="px-5 py-3.5 text-right">В пути</th></tr></thead><tbody className="divide-y divide-slate-100">{!pending && (data?.items.length ?? 0) === 0 && <tr><td colSpan={6} className="px-5 py-12 text-center text-slate-500">Товары не найдены</td></tr>}{data?.items.map((item) => <tr key={item.id} className="hover:bg-slate-50"><td className="px-5 py-4 font-medium text-slate-900">{item.name}</td><td className="px-5 py-4 text-slate-500">{item.code || item.article || "—"}</td><td className="px-5 py-4 text-right tabular-nums">{number.format(item.stock)} {item.uomName || "шт."}</td><td className="px-5 py-4 text-right tabular-nums text-slate-500">{number.format(item.reserve)}</td><td className="px-5 py-4 text-right font-semibold tabular-nums text-emerald-700">{number.format(item.available)}</td><td className="px-5 py-4 text-right tabular-nums text-slate-500">{number.format(item.inTransit)}</td></tr>)}</tbody></table></div></div>}
    {data && <div className="mt-4 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm shadow-sm"><span className="text-slate-600">Всего товаров: <b className="text-slate-900">{number.format(data.pagination.total)}</b></span><div className="flex items-center gap-3"><button disabled={pending || query.page <= 1} className="rounded-xl border border-slate-200 px-4 py-2 disabled:opacity-40" onClick={() => update({ page: query.page - 1 })}>Назад</button><span>{query.page} / {Math.max(data.pagination.totalPages, 1)}</span><button disabled={pending || query.page >= data.pagination.totalPages} className="rounded-xl border border-slate-200 px-4 py-2 disabled:opacity-40" onClick={() => update({ page: query.page + 1 })}>Вперёд</button></div></div>}
  </section>;
}
