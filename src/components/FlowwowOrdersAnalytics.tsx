"use client";

import { useState } from "react";
import { FlowwowOrdersFilters } from "@/components/FlowwowOrdersFilters";
import { FlowwowOrdersTable } from "@/components/FlowwowOrdersTable";
import { FlowwowOrdersUpload } from "@/components/FlowwowOrdersUpload";
import { FlowwowVisibilityToggle } from "@/components/FlowwowVisibilityToggle";
import { MetricCard } from "@/components/MetricCard";
import { Pagination } from "@/components/Pagination";
import { useFlowwowOrders } from "@/hooks/useFlowwowOrders";

const money = new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", notation: "compact", maximumFractionDigits: 1 });
const number = new Intl.NumberFormat("ru-RU");
const percent = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 1 });

export function FlowwowOrdersAnalytics() {
  const [areIndicatorsVisible, setAreIndicatorsVisible] = useState(true);
  const { query, data, error, isPending, updateQuery, reload } = useFlowwowOrders();
  const commissionShare = data?.summary.turnover
    ? data.summary.commissionExpenses / data.summary.turnover * 100
    : 0;
  return (
    <section className="relative mx-auto max-w-[1500px]">
      <div className="mb-7 sm:pr-[350px]"><p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">Маркетплейсы</p><h1 className="text-3xl font-bold tracking-tight text-slate-950">Заказы Flowwow</h1><p className="mt-2 text-sm text-slate-500">Заказы и оборот магазинов за выбранный период</p></div>
      <div className="mb-3 flex flex-wrap justify-end gap-2 sm:absolute sm:right-0 sm:top-0 sm:mb-0">
        <FlowwowOrdersUpload shopId={query.shopId} onUploaded={reload} />
        <FlowwowVisibilityToggle isVisible={areIndicatorsVisible} onToggle={() => setAreIndicatorsVisible((current) => !current)} />
      </div>
      {areIndicatorsVisible && <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><MetricCard label="Заказов" value={data ? number.format(data.summary.ordersCount) : "—"} note={`${query.dateFrom} — ${query.dateTo}`} /><MetricCard label="Оборот" value={data ? money.format(data.summary.turnover) : "—"} note="За выбранный период" accent /><MetricCard label="Средний чек" value={data ? money.format(data.summary.averageCheck) : "—"} note="На один заказ" /><MetricCard label="Расходы" value={data ? money.format(data.summary.commissionExpenses) : "—"} note={data ? `${percent.format(commissionShare)}% от общей суммы продаж` : "Комиссии Flowwow за период"} /></div>}
      <div className="mb-4"><FlowwowOrdersFilters query={query} shops={data?.shops ?? []} disabled={isPending} onUpdate={updateQuery} /></div>
      {error ? <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700"><p className="font-semibold">Не удалось получить заказы Flowwow</p><p className="mt-1">{error}. Проверьте маршрут backend на порту 3017.</p></div> : <FlowwowOrdersTable items={data?.items ?? []} pending={isPending} />}
      {data && <Pagination query={query} total={data.total} pageCount={data.totalPages} disabled={isPending} onUpdate={updateQuery} />}
    </section>
  );
}
