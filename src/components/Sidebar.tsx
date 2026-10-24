"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AccountMenu } from "@/components/AccountMenu";

function FlowerIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-4">
      <path d="M12 10.2c-2.6-4.8-7.6-3.5-7 0 .4 2.3 3.4 2.8 5.3 2.1-1.9.7-3.6 3.2-2 5 2.5 2.6 5.7-.9 4.3-4.2 1.4 3.3 5.4 4.1 6.4.7.8-2.5-1.7-4.2-3.7-4.1 2-.1 4.3-2.2 3.1-4.6-1.8-3.1-5.8-.8-6.1 2.4-.3-3.2-4.4-4.8-6-1.7-1.1 2.2 1.1 4.3 3.1 4.5" fill="currentColor" opacity=".95"/>
      <circle cx="12" cy="11" r="2.2" fill="currentColor"/>
    </svg>
  );
}

const staticNavigation = [
  {
    label: "Продажи и товары",
    href: "/analytics/products/profitability?dateFrom=2026-09-01&dateTo=2026-09-30&sortBy=grossProfit&sortDirection=desc&page=1&limit=50",
    match: "/analytics/products/profitability",
    icon: "↗",
  },
  {
    label: "Расходы и ДДС",
    href: "/analytics/expenses?dateFrom=2026-09-01&dateTo=2026-09-30&paymentType=all&page=1&limit=10",
    match: "/analytics/expenses",
    icon: "₽",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const navigation = [
    {
      label: "Flowwow",
      href: "/analytics/flowwow/products?status=active&linkStatus=all&availability=all&sortBy=sales&sortDirection=desc&page=1&limit=50",
      match: "/analytics/flowwow",
      icon: <FlowerIcon />,
    },
    ...staticNavigation,
  ];

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
        <div className="ml-auto"><AccountMenu variant="sidebar" /></div>
      </div>

      <nav aria-label="Основная навигация" className="flex gap-2 overflow-x-auto lg:flex-col">
        {navigation.map((item) => {
          const active = item.match
            ? pathname.startsWith(item.match)
            : pathname === item.href.split("?")[0];
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
