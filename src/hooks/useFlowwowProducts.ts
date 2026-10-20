"use client";

import { useCallback, useEffect, useMemo, useSyncExternalStore, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  defaultFlowwowProductsQuery,
  flowwowProductsStore,
  FlowwowProductsQuery,
} from "@/store/flowwow-products-store";

const limits = [10, 25, 50];
const statuses = ["all", "active", "hidden", "archived"] as const;
const linkStatuses = ["all", "linked", "unlinked"] as const;
const availabilities = ["all", "in_stock", "out_of_stock"] as const;
const sortFields = ["sales", "stock", "views", "profit"] as const;
const sortDirections = ["asc", "desc"] as const;
function positiveNumber(value: string | null, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export function useFlowwowProducts() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isNavigating, startTransition] = useTransition();
  const store = useSyncExternalStore(flowwowProductsStore.subscribe, flowwowProductsStore.getSnapshot, flowwowProductsStore.getServerSnapshot);
  const query = useMemo<FlowwowProductsQuery>(() => {
    const limit = positiveNumber(searchParams.get("limit"), defaultFlowwowProductsQuery.limit);
    const status = searchParams.get("status");
    const sortBy = searchParams.get("sortBy");
    const sortDirection = searchParams.get("sortDirection");
    const linkStatus = searchParams.get("linkStatus");
    const availability = searchParams.get("availability");
    return {
      search: searchParams.get("search")?.trim() ?? "",
      shopId: searchParams.get("shopId") || defaultFlowwowProductsQuery.shopId,
      status: statuses.includes(status as typeof statuses[number]) ? status as FlowwowProductsQuery["status"] : defaultFlowwowProductsQuery.status,
      linkStatus: linkStatuses.includes(linkStatus as typeof linkStatuses[number]) ? linkStatus as FlowwowProductsQuery["linkStatus"] : defaultFlowwowProductsQuery.linkStatus,
      availability: availabilities.includes(availability as typeof availabilities[number]) ? availability as FlowwowProductsQuery["availability"] : defaultFlowwowProductsQuery.availability,
      sortBy: sortFields.includes(sortBy as typeof sortFields[number]) ? sortBy as FlowwowProductsQuery["sortBy"] : defaultFlowwowProductsQuery.sortBy,
      sortDirection: sortDirections.includes(sortDirection as typeof sortDirections[number]) ? sortDirection as FlowwowProductsQuery["sortDirection"] : defaultFlowwowProductsQuery.sortDirection,
      page: positiveNumber(searchParams.get("page"), 1),
      limit: limits.includes(limit) ? limit : defaultFlowwowProductsQuery.limit,
    };
  }, [searchParams]);

  useEffect(() => { void flowwowProductsStore.load(query); }, [query]);

  const updateQuery = useCallback((patch: Partial<FlowwowProductsQuery>) => {
    const next = { ...query, ...patch };
    const params = new URLSearchParams({
      shopId: next.shopId,
      status: next.status,
      linkStatus: next.linkStatus,
      availability: next.availability,
      sortBy: next.sortBy,
      sortDirection: next.sortDirection,
      page: String(next.page),
      limit: String(next.limit),
    });
    if (next.search) params.set("search", next.search);
    startTransition(() => router.replace(`${pathname}?${params.toString()}`, { scroll: false }));
  }, [pathname, query, router]);

  async function changeVisibility(product: Parameters<typeof flowwowProductsStore.changeVisibility>[0], makeActive: boolean) {
    await flowwowProductsStore.changeVisibility(product, makeActive);
    await flowwowProductsStore.load(query, true);
  }

  async function reload() {
    await flowwowProductsStore.load(query, true);
  }

  return { query, ...store, isPending: isNavigating || store.isLoading, updateQuery, changeVisibility, reload };
}
