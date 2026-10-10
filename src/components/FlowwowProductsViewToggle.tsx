export type FlowwowProductsView = "grid" | "list";

type Props = {
  value: FlowwowProductsView;
  onChange: (value: FlowwowProductsView) => void;
};

export function FlowwowProductsViewToggle({ value, onChange }: Props) {
  return (
    <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm" aria-label="Вид товаров">
      <button type="button" aria-pressed={value === "grid"} className={`flex h-8 items-center gap-2 rounded-lg px-3 text-xs font-semibold transition ${value === "grid" ? "bg-slate-950 text-white" : "text-slate-500 hover:bg-slate-50"}`} onClick={() => onChange("grid")}>
        <svg className="size-4" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 3h5v5H3V3Zm9 0h5v5h-5V3ZM3 12h5v5H3v-5Zm9 0h5v5h-5v-5Z" stroke="currentColor" strokeWidth="1.5" /></svg>
        Сетка
      </button>
      <button type="button" aria-pressed={value === "list"} className={`flex h-8 items-center gap-2 rounded-lg px-3 text-xs font-semibold transition ${value === "list" ? "bg-slate-950 text-white" : "text-slate-500 hover:bg-slate-50"}`} onClick={() => onChange("list")}>
        <svg className="size-4" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 4h3v3H3V4Zm6 1.5h8M3 9h3v3H3V9Zm6 1.5h8M3 14h3v3H3v-3Zm6 1.5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
        Список
      </button>
    </div>
  );
}
