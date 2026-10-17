"use client";

import { Pagination } from "@/components/Pagination";
import { ProductsFilters } from "@/components/ProductsFilters";
import { ProductsSummaryDashboard } from "@/components/ProductsSummaryDashboard";
import { ProductsTable } from "@/components/ProductsTable";
import { useProductProfitability } from "@/hooks/useProductProfitability";

export function ProductsAnalytics() {
  const { query, data, error, isPending, updateQuery, changeSorting } = useProductProfitability();
  return (
    <section className="relative mx-auto max-w-[1500px]">
      <div className="mb-7 sm:pr-52"><p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">Продажи и товары</p><h1 className="text-3xl font-bold tracking-tight text-slate-950">Прибыльность товаров</h1><p className="mt-2 text-sm text-slate-500">Показатели ассортимента за выбранный период</p></div>
      <ProductsSummaryDashboard data={data} dateFrom={query.dateFrom} dateTo={query.dateTo} />
      <div className="mb-4"><ProductsFilters query={query} disabled={isPending} onUpdate={updateQuery} /></div>
      {error ? <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700"><p className="font-semibold">Не удалось получить данные</p><p className="mt-1">{error}. Проверьте, что API запущен на порту 3025.</p></div> : <ProductsTable products={data?.items ?? []} query={query} pending={isPending} onSort={changeSorting} />}
      {data && <Pagination query={query} total={data.pagination.totalItems} pageCount={data.pagination.totalPages} disabled={isPending} onUpdate={updateQuery} />}
    </section>
  );
}
