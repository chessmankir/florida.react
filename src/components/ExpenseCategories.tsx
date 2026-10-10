import { ExpenseCategory } from "@/store/expenses-store";

type ExpenseCategoriesProps = { categories: ExpenseCategory[] };
const money = new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 });

export function ExpenseCategories({ categories }: ExpenseCategoriesProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4"><h2 className="font-semibold text-slate-950">Структура расходов</h2><p className="mt-1 text-xs text-slate-500">Распределение по статьям ДДС</p></div>
      <div className="grid gap-4 lg:grid-cols-3">
        {categories.map((category) => (
          <article key={category.expenseItemId}>
            <div className="mb-2 flex items-start justify-between gap-3 text-sm"><div><p className="font-medium text-slate-800">{category.expenseItemName}</p><p className="mt-0.5 text-xs text-slate-400">{category.paymentsCount} операций</p></div><p className="whitespace-nowrap font-semibold text-slate-950">{money.format(category.total)}</p></div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.min(category.sharePercent, 100)}%` }} /></div>
            <p className="mt-1 text-right text-xs font-medium text-slate-500">{category.sharePercent.toFixed(1)}%</p>
          </article>
        ))}
      </div>
    </section>
  );
}
