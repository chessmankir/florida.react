"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  defaultFlowwowProductsQuery,
  flowwowProductsStore,
  FlowwowProductsQuery,
} from "@/store/flowwow-products-store";

const limits = [10, 25, 50];
const statuses = ["all", "active", "hidden", "archived"] as const;
const sortFields = ["sales", "stock", "views"] as const;
const sortDirections = ["asc", "desc"] as const;
function positiveNumber(value: string | null, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export function useFlowwowProducts() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const store = useSyncExternalStore(flowwowProductsStore.subscribe, flowwowProductsStore.getSnapshot, flowwowProductsStore.getServerSnapshot);
  const [query, setQuery] = useState<FlowwowProductsQuery>(() => {
    const limit = positiveNumber(searchParams.get("limit"), defaultFlowwowProductsQuery.limit);
    const status = searchParams.get("status");
    const sortBy = searchParams.get("sortBy");
    const sortDirection = searchParams.get("sortDirection");
    return {
      search: searchParams.get("search")?.trim() ?? "",
      shopId: searchParams.get("shopId") || defaultFlowwowProductsQuery.shopId,
      status: statuses.includes(status as typeof statuses[number]) ? status as FlowwowProductsQuery["status"] : defaultFlowwowProductsQuery.status,
      sortBy: sortFields.includes(sortBy as typeof sortFields[number]) ? sortBy as FlowwowProductsQuery["sortBy"] : defaultFlowwowProductsQuery.sortBy,
      sortDirection: sortDirections.includes(sortDirection as typeof sortDirections[number]) ? sortDirection as FlowwowProductsQuery["sortDirection"] : defaultFlowwowProductsQuery.sortDirection,
      page: positiveNumber(searchParams.get("page"), 1),
      limit: limits.includes(limit) ? limit : defaultFlowwowProductsQuery.limit,
    };
  });

  useEffect(() => { void flowwowProductsStore.load(query); }, [query]);

  function updateQuery(patch: Partial<FlowwowProductsQuery>) {
    const next = { ...query, ...patch };
    const params = new URLSearchParams({
      shopId: next.shopId,
      status: next.status,
      sortBy: next.sortBy,
      sortDirection: next.sortDirection,
      page: String(next.page),
      limit: String(next.limit),
    });
    if (next.search) params.set("search", next.search);
    window.history.replaceState(null, "", `${pathname}?${params.toString()}`);
    setQuery(next);
  }

  async function changeVisibility(product: Parameters<typeof flowwowProductsStore.changeVisibility>[0], makeActive: boolean) {
    await flowwowProductsStore.changeVisibility(product, makeActive);
    await flowwowProductsStore.load(query, true);
  }

  async function reload() {
    await flowwowProductsStore.load(query, true);
  }

  return { query, ...store, isPending: store.isLoading, updateQuery, changeVisibility, reload };
}
