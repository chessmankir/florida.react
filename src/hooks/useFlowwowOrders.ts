"use client";

import { useCallback, useEffect, useMemo, useSyncExternalStore, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { flowwowOrdersStore, FlowwowOrdersQuery, getDefaultFlowwowOrdersQuery } from "@/store/flowwow-orders-store";

const limits = [10, 25, 50];
function positiveNumber(value: string | null, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export function useFlowwowOrders() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, startTransition] = useTransition();
  const store = useSyncExternalStore(flowwowOrdersStore.subscribe, flowwowOrdersStore.getSnapshot, flowwowOrdersStore.getServerSnapshot);
  const defaults = useMemo(() => getDefaultFlowwowOrdersQuery(), []);
  const query = useMemo<FlowwowOrdersQuery>(() => {
    const limit = positiveNumber(searchParams.get("limit"), defaults.limit);
    return {
      dateFrom: searchParams.get("dateFrom") || defaults.dateFrom,
      dateTo: searchParams.get("dateTo") || defaults.dateTo,
      shopId: searchParams.get("shopId") || defaults.shopId,
      page: positiveNumber(searchParams.get("page"), defaults.page),
      limit: limits.includes(limit) ? limit : defaults.limit,
    };
  }, [defaults, searchParams]);

  useEffect(() => { void flowwowOrdersStore.load(query); }, [query]);

  const updateQuery = useCallback((patch: Partial<FlowwowOrdersQuery>) => {
    const nextQuery = { ...query, ...patch };
    const params = new URLSearchParams({ dateFrom: nextQuery.dateFrom, dateTo: nextQuery.dateTo, page: String(nextQuery.page), limit: String(nextQuery.limit) });
    if (nextQuery.shopId) params.set("shopId", nextQuery.shopId);
    startTransition(() => router.replace(`${pathname}?${params.toString()}`, { scroll: false }));
  }, [pathname, query, router]);

  async function reload() {
    await flowwowOrdersStore.load(query, true);
  }

  return { query, ...store, isPending: isNavigating || store.isLoading, updateQuery, reload };
}
