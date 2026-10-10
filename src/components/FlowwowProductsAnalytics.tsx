"use client";

import { useState } from "react";
import { FlowwowProductsFilters } from "@/components/FlowwowProductsFilters";
import { FlowwowProductsGrid } from "@/components/FlowwowProductsGrid";
import { FlowwowProductsList } from "@/components/FlowwowProductsList";
import { FlowwowProductsSyncButton } from "@/components/FlowwowProductsSyncButton";
import { FlowwowProductsView, FlowwowProductsViewToggle } from "@/components/FlowwowProductsViewToggle";
import { Pagination } from "@/components/Pagination";
import { useFlowwowProducts } from "@/hooks/useFlowwowProducts";

export function FlowwowProductsAnalytics() {
  const [view, setView] = useState<FlowwowProductsView>("grid");
  const { query, data, error, isPending, updateQuery, changeVisibility, reload } = useFlowwowProducts();

  return (
    <section className="mx-auto max-w-[1500px]">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">Flowwow</p><h1 className="text-3xl font-bold tracking-tight text-slate-950">Витрина товаров</h1><p className="mt-2 text-sm text-slate-500">Каталог, остатки и показатели товаров магазина</p></div>
        <div className="flex flex-col items-end gap-2">
          <FlowwowProductsSyncButton onSynced={reload} />
          <FlowwowProductsViewToggle value={view} onChange={setView} />
        </div>
      </div>
      <div className="mb-5"><FlowwowProductsFilters query={query} shops={data?.shops ?? []} disabled={isPending} onUpdate={updateQuery} /></div>
      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700"><p className="font-semibold">Не удалось получить товары Flowwow</p><p className="mt-1">{error}. Проверьте маршрут backend на порту 3017.</p></div>
      ) : view === "grid" ? (
        <FlowwowProductsGrid products={data?.items ?? []} pending={isPending} onVisibilityChange={changeVisibility} />
      ) : (
        <FlowwowProductsList products={data?.items ?? []} pending={isPending} onVisibilityChange={changeVisibility} />
      )}
      {data && <Pagination query={query} total={data.pagination.total} pageCount={data.pagination.totalPages} disabled={isPending} onUpdate={updateQuery} />}
    </section>
  );
}
