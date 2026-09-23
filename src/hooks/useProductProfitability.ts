"use client";

import { useCallback, useEffect, useMemo, useSyncExternalStore, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { defaultProductsQuery, ProductSortKey, productsStore, ProductsQuery, SortDirection } from "@/store/products-store";

const sortKeys: ProductSortKey[] = ["name", "revenue", "cost", "grossProfit", "marginPercent", "soldQuantity"];
const limits = [10, 25, 50];

function positiveNumber(value: string | null, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export function useProductProfitability() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, startTransition] = useTransition();
  const store = useSyncExternalStore(productsStore.subscribe, productsStore.getSnapshot, productsStore.getServerSnapshot);

  const query = useMemo<ProductsQuery>(() => {
    const sortBy = searchParams.get("sortBy") as ProductSortKey | null;
    const sortDirection = searchParams.get("sortDirection") as SortDirection | null;
    const limit = positiveNumber(searchParams.get("limit"), defaultProductsQuery.limit);
    return {
      dateFrom: searchParams.get("dateFrom") || defaultProductsQuery.dateFrom,
      dateTo: searchParams.get("dateTo") || defaultProductsQuery.dateTo,
      sortBy: sortBy && sortKeys.includes(sortBy) ? sortBy : defaultProductsQuery.sortBy,
      sortDirection: sortDirection === "asc" || sortDirection === "desc" ? sortDirection : defaultProductsQuery.sortDirection,
      page: positiveNumber(searchParams.get("page"), defaultProductsQuery.page),
      limit: limits.includes(limit) ? limit : defaultProductsQuery.limit,
    };
  }, [searchParams]);

  useEffect(() => {
    void productsStore.load(query);
  }, [query]);

  const updateQuery = useCallback((patch: Partial<ProductsQuery>) => {
    const nextQuery = { ...query, ...patch };
    const params = new URLSearchParams({
      dateFrom: nextQuery.dateFrom,
      dateTo: nextQuery.dateTo,
      sortBy: nextQuery.sortBy,
      sortDirection: nextQuery.sortDirection,
      page: String(nextQuery.page),
      limit: String(nextQuery.limit),
    });
    startTransition(() => router.replace(`${pathname}?${params.toString()}`, { scroll: false }));
  }, [pathname, query, router]);

  const changeSorting = useCallback((sortBy: ProductSortKey) => {
    updateQuery({
      sortBy,
      sortDirection: query.sortBy === sortBy && query.sortDirection === "desc" ? "asc" : "desc",
      page: 1,
    });
  }, [query.sortBy, query.sortDirection, updateQuery]);

  return { query, ...store, isPending: isNavigating || store.isLoading, updateQuery, changeSorting };
}
