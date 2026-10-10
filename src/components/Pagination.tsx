type PaginationQuery = { page: number; limit: number };

type PaginationProps = {
  query: PaginationQuery;
  total: number;
  pageCount: number;
  disabled: boolean;
  onUpdate: (patch: Partial<PaginationQuery>) => void;
};

export function Pagination({ query, total, pageCount, disabled, onUpdate }: PaginationProps) {
  const first = total === 0 ? 0 : (query.page - 1) * query.limit + 1;
  const last = Math.min(query.page * query.limit, total);

  return (
    <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <p>Показано <span className="font-semibold text-slate-900">{first}–{last}</span> из <span className="font-semibold text-slate-900">{total}</span></p>
      <div className="flex flex-wrap items-center gap-2">
        <label className="mr-2 flex items-center gap-2 text-xs font-medium">
          На странице
          <select className="h-9 rounded-lg border border-slate-200 bg-white px-2 outline-none focus:border-emerald-500" value={query.limit} disabled={disabled} onChange={(event) => onUpdate({ limit: Number(event.target.value), page: 1 })}>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </label>
        <button type="button" className="h-9 rounded-lg border border-slate-200 px-3 font-medium transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40" disabled={disabled || query.page <= 1} onClick={() => onUpdate({ page: query.page - 1 })}>Назад</button>
        <span className="min-w-20 text-center text-xs font-semibold text-slate-700">{query.page} / {pageCount}</span>
        <button type="button" className="h-9 rounded-lg border border-slate-200 px-3 font-medium transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40" disabled={disabled || query.page >= pageCount} onClick={() => onUpdate({ page: query.page + 1 })}>Вперёд</button>
      </div>
    </div>
  );
}
