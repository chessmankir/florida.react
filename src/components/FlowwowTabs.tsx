"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSyncExternalStore, useTransition } from "react";
import { getCurrentMonthRange } from "@/lib/date-range";
import { flowwowOrdersStore, getDefaultFlowwowOrdersQuery } from "@/store/flowwow-orders-store";
import { defaultFlowwowProductsQuery, flowwowProductsStore, type FlowwowProductsQuery } from "@/store/flowwow-products-store";

function positiveNumber(value: string | null, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export function FlowwowTabs() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const orders = useSyncExternalStore(flowwowOrdersStore.subscribe, flowwowOrdersStore.getSnapshot, flowwowOrdersStore.getServerSnapshot);
  const products = useSyncExternalStore(flowwowProductsStore.subscribe, flowwowProductsStore.getSnapshot, flowwowProductsStore.getServerSnapshot);
  const period = getCurrentMonthRange();
  const shopId = searchParams.get("shopId") || "191599";
  const shops = pathname.endsWith("/orders")
    ? orders.data?.shops ?? []
    : products.data?.shops ?? [];
  const tabs = [
    {
      label: "Товары",
      href: `/analytics/flowwow/products?shopId=${encodeURIComponent(shopId)}&status=active&linkStatus=all&availability=all&sortBy=sales&sortDirection=desc&page=1&limit=50`,
      active: pathname.endsWith("/products"),
    },
    {
      label: "Заказы",
      href: `/analytics/flowwow/orders?dateFrom=${period.dateFrom}&dateTo=${period.dateTo}&shopId=${encodeURIComponent(shopId)}&page=1&limit=50`,
      active: pathname.endsWith("/orders"),
    },
  ];

  return (
    <div className="mx-auto mb-6 flex max-w-[1500px] items-end justify-between gap-4 border-b border-slate-200">
      <nav aria-label="Разделы Flowwow" className="flex gap-1">
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
      <label className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-500">
        <span className="hidden sm:inline">Магазин</span>
        <select
          value={shopId}
          disabled={pending}
          className="h-10 min-w-48 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-900 outline-none transition focus:border-emerald-500 disabled:opacity-60"
          onChange={(event) => {
            const selectedShopId = event.target.value;
            const params = new URLSearchParams(searchParams.toString());
            params.set("shopId", selectedShopId);
            params.set("page", "1");
            if (pathname.endsWith("/orders")) {
              const defaults = getDefaultFlowwowOrdersQuery();
              void flowwowOrdersStore.load({
                dateFrom: params.get("dateFrom") || defaults.dateFrom,
                dateTo: params.get("dateTo") || defaults.dateTo,
                shopId: selectedShopId,
                page: 1,
                limit: positiveNumber(params.get("limit"), defaults.limit),
              }, true);
            } else {
              const status = params.get("status");
              const sortBy = params.get("sortBy");
              const linkStatus = params.get("linkStatus");
              const availability = params.get("availability");
              const sortDirection = params.get("sortDirection");
              void flowwowProductsStore.load({
                search: params.get("search")?.trim() ?? "",
                shopId: selectedShopId,
                status: ["all", "active", "hidden", "archived"].includes(status ?? "")
                  ? status as FlowwowProductsQuery["status"]
                  : defaultFlowwowProductsQuery.status,
                linkStatus: ["all", "linked", "unlinked"].includes(linkStatus ?? "")
                  ? linkStatus as FlowwowProductsQuery["linkStatus"]
                  : defaultFlowwowProductsQuery.linkStatus,
                availability: ["all", "in_stock", "out_of_stock"].includes(availability ?? "")
                  ? availability as FlowwowProductsQuery["availability"]
                  : defaultFlowwowProductsQuery.availability,
                sortBy: ["sales", "stock", "views", "profit"].includes(sortBy ?? "")
                  ? sortBy as FlowwowProductsQuery["sortBy"]
                  : defaultFlowwowProductsQuery.sortBy,
                sortDirection: sortDirection === "asc" || sortDirection === "desc"
                  ? sortDirection
                  : defaultFlowwowProductsQuery.sortDirection,
                page: 1,
                limit: positiveNumber(params.get("limit"), defaultFlowwowProductsQuery.limit),
              }, true);
            }
            startTransition(() => router.replace(`${pathname}?${params.toString()}`, { scroll: false }));
          }}
        >
          {!shops.some((shop) => shop.id === shopId) && <option value={shopId}>Магазин {shopId}</option>}
          {shops.map((shop) => <option key={shop.id} value={shop.id}>{shop.address || shop.name || `Магазин ${shop.id}`}</option>)}
        </select>
      </label>
    </div>
  );
}
