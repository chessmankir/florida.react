type MetricCardProps = {
  label: string;
  value: string;
  note: string;
  accent?: boolean;
};

export function MetricCard({ label, value, note, accent = false }: MetricCardProps) {
  return (
    <article className={`rounded-2xl border p-5 shadow-sm ${accent ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-white"}`}>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold tracking-tight text-slate-950">{value}</p>
      <p className={`mt-2 text-xs ${accent ? "text-emerald-700" : "text-slate-400"}`}>{note}</p>
    </article>
  );
}
