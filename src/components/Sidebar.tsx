"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { label: "Дашборд", href: "/dashboard", icon: "▦" },
  {
    label: "Продажи и товары",
    href: "/analytics/products/profitability?dateFrom=2026-09-01&dateTo=2026-09-30&sortBy=grossProfit&sortDirection=desc&page=1&limit=50",
    match: "/analytics/products/profitability",
    icon: "↗",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-b border-slate-200 bg-slate-950 px-4 py-5 text-white lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:shrink-0 lg:border-b-0 lg:px-6 lg:py-8">
      <div className="mb-5 flex items-center gap-3 px-2 lg:mb-10">
        <div className="grid size-10 place-items-center rounded-xl bg-emerald-400 font-black text-slate-950">
          F
        </div>
        <div>
          <p className="text-lg font-bold tracking-tight">Florida</p>
          <p className="text-xs text-slate-400">Центр аналитики</p>
        </div>
      </div>

      <nav aria-label="Основная навигация" className="flex gap-2 overflow-x-auto lg:flex-col">
        {navigation.map((item) => {
          const active = pathname === (item.match ?? item.href.split("?")[0]);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex min-w-max items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
                active
                  ? "bg-white text-slate-950 shadow-sm"
                  : "text-slate-300 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <span className={`grid size-7 place-items-center rounded-lg text-base ${active ? "bg-emerald-100 text-emerald-700" : "bg-slate-800"}`}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
