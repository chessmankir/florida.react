"use client";

import { useState } from "react";
import { ExpenseCategories } from "@/components/ExpenseCategories";
import { ExpensesFilters } from "@/components/ExpensesFilters";
import { ExpensesPagination } from "@/components/ExpensesPagination";
import { ExpensesSummary } from "@/components/ExpensesSummary";
import { ExpensesTable } from "@/components/ExpensesTable";
import { ExpensesVisibilityToggle } from "@/components/ExpensesVisibilityToggle";
import { useExpenses } from "@/hooks/useExpenses";

export function ExpensesAnalytics() {
  const [areIndicatorsVisible, setAreIndicatorsVisible] = useState(true);
  const { query, data, error, isPending, updateQuery } = useExpenses();
  return (
    <section className="relative mx-auto max-w-[1500px]">
      <div className="mb-7 sm:pr-52"><p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">Финансы</p><h1 className="text-3xl font-bold tracking-tight text-slate-950">Расходы и ДДС</h1><p className="mt-2 text-sm text-slate-500">Движение денежных средств и структура расходов за выбранный период</p></div>
      <ExpensesVisibilityToggle isVisible={areIndicatorsVisible} onToggle={() => setAreIndicatorsVisible((current) => !current)} />
      {areIndicatorsVisible && <ExpensesSummary data={data} dateFrom={query.dateFrom} dateTo={query.dateTo} />}
      <div className="mb-4"><ExpensesFilters query={query} disabled={isPending} onUpdate={updateQuery} /></div>
      {areIndicatorsVisible && data && <div className="mb-4"><ExpenseCategories categories={data.categories} /></div>}
      {error ? <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700"><p className="font-semibold">Не удалось получить данные</p><p className="mt-1">{error}. Проверьте, что API запущен на порту 3025.</p></div> : <ExpensesTable items={data?.items ?? []} pending={isPending} />}
      {data && <ExpensesPagination query={query} total={data.pagination.totalItems} pageCount={data.pagination.totalPages} disabled={isPending} onUpdate={updateQuery} />}
    </section>
  );
}
