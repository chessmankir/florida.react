"use client";

import { useCallback, useEffect, useMemo, useSyncExternalStore, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { defaultExpensesQuery, expensesStore, ExpensesQuery } from "@/store/expenses-store";

const limits = [10, 25, 50];

function positiveNumber(value: string | null, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export function useExpenses() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, startTransition] = useTransition();
  const store = useSyncExternalStore(expensesStore.subscribe, expensesStore.getSnapshot, expensesStore.getServerSnapshot);

  const query = useMemo<ExpensesQuery>(() => {
    const limit = positiveNumber(searchParams.get("limit"), defaultExpensesQuery.limit);
    return {
      dateFrom: searchParams.get("dateFrom") || defaultExpensesQuery.dateFrom,
      dateTo: searchParams.get("dateTo") || defaultExpensesQuery.dateTo,
      page: positiveNumber(searchParams.get("page"), defaultExpensesQuery.page),
      limit: limits.includes(limit) ? limit : defaultExpensesQuery.limit,
    };
  }, [searchParams]);

  useEffect(() => {
    void expensesStore.load(query);
  }, [query]);

  const updateQuery = useCallback((patch: Partial<ExpensesQuery>) => {
    const nextQuery = { ...query, ...patch };
    const params = new URLSearchParams({
      dateFrom: nextQuery.dateFrom,
      dateTo: nextQuery.dateTo,
      page: String(nextQuery.page),
      limit: String(nextQuery.limit),
    });
    startTransition(() => router.replace(`${pathname}?${params.toString()}`, { scroll: false }));
  }, [pathname, query, router]);

  return { query, ...store, isPending: isNavigating || store.isLoading, updateQuery };
}
