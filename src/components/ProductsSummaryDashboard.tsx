"use client";

import { useState } from "react";
import { MetricCard } from "@/components/MetricCard";
import { ProductsResponse } from "@/store/products-store";

type ProductsSummaryDashboardProps = {
  data: ProductsResponse | null;
  dateFrom: string;
  dateTo: string;
};

const money = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  notation: "compact",
  maximumFractionDigits: 1,
});
const number = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 2 });

export function ProductsSummaryDashboard({ data, dateFrom, dateTo }: ProductsSummaryDashboardProps) {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <section className="mb-5" aria-label="Сводные показатели">
      <button
          type="button"
          aria-expanded={isVisible}
          aria-controls="products-summary-dashboard"
          className="mb-3 ml-auto flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 sm:absolute sm:right-0 sm:top-0 sm:mb-0"
          onClick={() => setIsVisible((current) => !current)}
        >
          {isVisible ? "Скрыть показатели" : "Показать показатели"}
          <svg className={`size-4 transition-transform ${isVisible ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="m6 8 4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
      </button>

      {isVisible && (
        <div id="products-summary-dashboard" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Выручка" value={data ? money.format(data.summary.revenue) : "—"} note={data ? `${data.summary.productsCount} товарных позиций` : "Загрузка данных"} />
          <MetricCard label="Валовая прибыль" value={data ? money.format(data.summary.grossProfit) : "—"} note="За выбранный период" accent />
          <MetricCard label="Средняя маржа" value={data ? `${data.summary.marginPercent.toFixed(1)}%` : "—"} note={data ? `Возвраты ${data.summary.returnRatePercent.toFixed(1)}%` : "Загрузка данных"} />
          <MetricCard label="Продано единиц" value={data ? number.format(data.summary.netSoldQuantity) : "—"} note={`${dateFrom} — ${dateTo}`} />
        </div>
      )}
    </section>
  );
}
