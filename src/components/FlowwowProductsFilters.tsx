"use client";

import { useRef } from "react";
import { FlowwowProductsQuery } from "@/store/flowwow-products-store";

type Props = {
  query: FlowwowProductsQuery;
  shops: Array<{ id: string; name: string; address: string | null }>;
  disabled: boolean;
  onUpdate: (patch: Partial<FlowwowProductsQuery>) => void;
};

export function FlowwowProductsFilters({ query, shops, disabled, onUpdate }: Props) {
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function changeSearch(value: string) {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      const search = value.trim();
      if (search !== query.search) onUpdate({ search, page: 1 });
    }, 350);
  }

  return (
    <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 xl:grid-cols-[minmax(220px,1.4fr)_200px_170px_210px_160px] xl:items-end">
      <label className="text-xs font-semibold text-slate-500">
        Поиск по названию
        <div className="relative mt-1.5">
          <svg className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.6" />
            <path d="m13 13 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <input
            name="search"
            type="search"
            defaultValue={query.search}
            placeholder="Например, ромашка"
            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm font-medium text-slate-900 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-emerald-500 disabled:opacity-60"
            onChange={(event) => changeSearch(event.target.value)}
          />
        </div>
      </label>
      <label className="text-xs font-semibold text-slate-500">
        Магазин
        <select
          value={query.shopId}
          disabled={disabled}
          className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-900 outline-none transition focus:border-emerald-500 disabled:opacity-60"
          onChange={(event) => onUpdate({ shopId: event.target.value, page: 1 })}
        >
          {shops.length === 0 && <option value={query.shopId}>Магазин {query.shopId}</option>}
          {shops.map((shop) => <option key={shop.id} value={shop.id}>{shop.address || shop.name || `Магазин ${shop.id}`}</option>)}
        </select>
      </label>
      <label className="text-xs font-semibold text-slate-500">
        Статус
        <select
          value={query.status}
          disabled={disabled}
          className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-900 outline-none transition focus:border-emerald-500 disabled:opacity-60"
          onChange={(event) => onUpdate({ status: event.target.value as FlowwowProductsQuery["status"], page: 1 })}
        >
          <option value="all">Все товары</option>
          <option value="active">Активные</option>
          <option value="hidden">Скрытые</option>
          <option value="archived">В архиве</option>
        </select>
      </label>
      <label className="text-xs font-semibold text-slate-500">
        Сортировать по
        <select
          value={query.sortBy}
          disabled={disabled}
          className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-900 outline-none transition focus:border-emerald-500 disabled:opacity-60"
          onChange={(event) => onUpdate({ sortBy: event.target.value as FlowwowProductsQuery["sortBy"], page: 1 })}
        >
          <option value="sales">Выручка</option>
          <option value="views">Просмотры</option>
          <option value="stock">Остаток</option>
        </select>
      </label>
      <label className="text-xs font-semibold text-slate-500">
        Направление
        <select
          value={query.sortDirection}
          disabled={disabled}
          className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-900 outline-none transition focus:border-emerald-500 disabled:opacity-60"
          onChange={(event) => onUpdate({ sortDirection: event.target.value as FlowwowProductsQuery["sortDirection"], page: 1 })}
        >
          <option value="desc">Сначала больше</option>
          <option value="asc">Сначала меньше</option>
        </select>
      </label>
    </div>
  );
}
