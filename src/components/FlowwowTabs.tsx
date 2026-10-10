"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getCurrentMonthRange } from "@/lib/date-range";

export function FlowwowTabs() {
  const pathname = usePathname();
  const period = getCurrentMonthRange();
  const tabs = [
    {
      label: "Заказы",
      href: `/analytics/flowwow/orders?dateFrom=${period.dateFrom}&dateTo=${period.dateTo}&page=1&limit=50`,
      active: pathname.endsWith("/orders"),
    },
    {
      label: "Товары",
      href: "/analytics/flowwow/products?shopId=191599&status=active&sortBy=sales&sortDirection=desc&page=1&limit=50",
      active: pathname.endsWith("/products"),
    },
  ];

  return (
    <nav aria-label="Разделы Flowwow" className="mx-auto mb-6 flex max-w-[1500px] gap-1 border-b border-slate-200">
      {tabs.map((tab) => (
        <Link
          key={tab.label}
          href={tab.href}
          className={`relative px-4 py-3 text-sm font-semibold transition ${
            tab.active ? "text-emerald-700" : "text-slate-500 hover:text-slate-900"
          }`}
        >
          {tab.label}
          {tab.active && <span className="absolute inset-x-1 -bottom-px h-0.5 rounded-full bg-emerald-500" />}
        </Link>
      ))}
    </nav>
  );
}
