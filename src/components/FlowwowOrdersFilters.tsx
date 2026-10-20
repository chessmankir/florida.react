import { FlowwowOrdersQuery } from "@/store/flowwow-orders-store";

type Props = { query: FlowwowOrdersQuery; disabled: boolean; onUpdate: (patch: Partial<FlowwowOrdersQuery>) => void };
const fieldClass = "h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10";

export function FlowwowOrdersFilters({ query, disabled, onUpdate }: Props) {
  return (
    <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2">
      <label className="grid gap-1.5 text-xs font-semibold text-slate-500">Дата от<input className={fieldClass} type="date" value={query.dateFrom} max={query.dateTo} disabled={disabled} onChange={(event) => onUpdate({ dateFrom: event.target.value, page: 1 })} /></label>
      <label className="grid gap-1.5 text-xs font-semibold text-slate-500">Дата до<input className={fieldClass} type="date" value={query.dateTo} min={query.dateFrom} disabled={disabled} onChange={(event) => onUpdate({ dateTo: event.target.value, page: 1 })} /></label>
    </div>
  );
}
