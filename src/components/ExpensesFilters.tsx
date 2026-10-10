import { ExpensesQuery } from "@/store/expenses-store";

type ExpensesFiltersProps = {
  query: ExpensesQuery;
  disabled: boolean;
  onUpdate: (patch: Partial<ExpensesQuery>) => void;
};

const inputClassName = "h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10";

export function ExpensesFilters({ query, disabled, onUpdate }: ExpensesFiltersProps) {
  return (
    <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:max-w-2xl">
      <label className="grid gap-1.5 text-xs font-semibold text-slate-500">
        Дата от
        <input className={inputClassName} type="date" value={query.dateFrom} max={query.dateTo} disabled={disabled} onChange={(event) => onUpdate({ dateFrom: event.target.value, page: 1 })} />
      </label>
      <label className="grid gap-1.5 text-xs font-semibold text-slate-500">
        Дата до
        <input className={inputClassName} type="date" value={query.dateTo} min={query.dateFrom} disabled={disabled} onChange={(event) => onUpdate({ dateTo: event.target.value, page: 1 })} />
      </label>
    </div>
  );
}
