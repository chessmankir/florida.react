export function DashboardPlaceholder() {
  return (
    <section className="mx-auto max-w-7xl">
      <p className="mb-2 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">Обзор</p>
      <h1 className="text-3xl font-bold tracking-tight text-slate-950">Дашборд</h1>
      <div className="mt-8 grid min-h-96 place-items-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
        <div>
          <div className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl bg-slate-100 text-2xl text-slate-500">▦</div>
          <h2 className="text-lg font-semibold text-slate-900">Раздел готов к наполнению</h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
            Здесь появятся ключевые показатели и графики бизнеса.
          </p>
        </div>
      </div>
    </section>
  );
}
