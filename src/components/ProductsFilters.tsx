import { ProductSortKey, ProductsQuery } from "@/store/products-store";

type ProductsFiltersProps = { query: ProductsQuery; disabled: boolean; onUpdate: (patch: Partial<ProductsQuery>) => void };
const inputClassName = "h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10";

export function ProductsFilters({ query, disabled, onUpdate }: ProductsFiltersProps) {
  return (
    <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 xl:grid-cols-[1fr_1fr_1.2fr_auto]">
      <label className="grid gap-1.5 text-xs font-semibold text-slate-500">Дата от
        <input className={inputClassName} type="date" value={query.dateFrom} max={query.dateTo} disabled={disabled} onChange={(event) => onUpdate({ dateFrom: event.target.value, page: 1 })} />
      </label>
      <label className="grid gap-1.5 text-xs font-semibold text-slate-500">Дата до
        <input className={inputClassName} type="date" value={query.dateTo} min={query.dateFrom} disabled={disabled} onChange={(event) => onUpdate({ dateTo: event.target.value, page: 1 })} />
      </label>
      <label className="grid gap-1.5 text-xs font-semibold text-slate-500">Сортировать по
        <select className={inputClassName} value={query.sortBy} disabled={disabled} onChange={(event) => onUpdate({ sortBy: event.target.value as ProductSortKey, page: 1 })}>
          <option value="grossProfit">Валовая прибыль</option><option value="revenue">Выручка</option><option value="cost">Себестоимость</option><option value="marginPercent">Маржинальность</option><option value="soldQuantity">Продано</option><option value="name">Название</option>
        </select>
      </label>
      <div className="flex items-end">
        <button type="button" disabled={disabled} className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50" onClick={() => onUpdate({ sortDirection: query.sortDirection === "desc" ? "asc" : "desc", page: 1 })}>
          {query.sortDirection === "desc" ? "↓ По убыванию" : "↑ По возрастанию"}
        </button>
      </div>
    </div>
  );
}
