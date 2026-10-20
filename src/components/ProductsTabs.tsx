"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { label: "Продажи", href: "/analytics/products/profitability?dateFrom=2026-09-01&dateTo=2026-09-30&sortBy=grossProfit&sortDirection=desc&page=1&limit=50", path: "/analytics/products/profitability" },
  { label: "Остатки", href: "/analytics/products/inventory?sortBy=available&sortDirection=desc&page=1&limit=50", path: "/analytics/products/inventory" },
  { label: "Расход товара", href: "/analytics/products/consumption?periodDays=7&sortDirection=asc&endingWithinWeek=false&page=1&limit=50", path: "/analytics/products/consumption" },
];

export function ProductsTabs() {
  const pathname = usePathname();
  return (
    <nav aria-label="Продажи и товары" className="mb-7 flex gap-1 border-b border-slate-200">
      {tabs.map((tab) => {
        const active = pathname === tab.path;
        return <Link key={tab.label} href={tab.href} className={`relative px-4 py-3 text-sm font-semibold transition ${active ? "text-emerald-700" : "text-slate-500 hover:text-slate-900"}`}>{tab.label}{active && <span className="absolute inset-x-1 -bottom-px h-0.5 rounded-full bg-emerald-500" />}</Link>;
      })}
    </nav>
  );
}
