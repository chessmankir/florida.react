import { ExpenseItem } from "@/store/expenses-store";

type ExpensesTableProps = { items: ExpenseItem[]; pending: boolean };
const money = new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 });
const dateTime = new Intl.DateTimeFormat("ru-RU", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Moscow" });

function paymentTypeLabel(paymentType: string) {
  if (paymentType === "cashout") return "Наличные";
  if (paymentType === "paymentout") return "Безналичные";
  if (paymentType === "loss") return "Списание";
  return paymentType;
}

export function ExpensesTable({ items, pending }: ExpensesTableProps) {
  return (
    <div className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-opacity ${pending ? "opacity-60" : "opacity-100"}`}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] border-collapse text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3.5 text-left font-semibold">Дата</th><th className="px-5 py-3.5 text-left font-semibold">Документ</th><th className="px-5 py-3.5 text-left font-semibold">Статья ДДС</th><th className="px-5 py-3.5 text-left font-semibold">Тип</th><th className="px-5 py-3.5 text-left font-semibold">Описание</th><th className="px-5 py-3.5 text-right font-semibold">Сумма</th><th className="px-5 py-3.5 text-center font-semibold">Статус</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item.id} className="transition-colors hover:bg-slate-50/80">
                <td className="whitespace-nowrap px-5 py-4 text-slate-600">{dateTime.format(new Date(item.moment))}</td>
                <td className="px-5 py-4 font-mono text-xs font-semibold text-slate-800">{item.name}</td>
                <td className="px-5 py-4 font-medium text-slate-800">{item.expenseItemName || "Без статьи"}</td>
                <td className="px-5 py-4"><span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">{paymentTypeLabel(item.paymentType)}</span></td>
                <td className="max-w-[360px] px-5 py-4"><p className="truncate text-slate-500" title={item.description || "Описание не указано"}>{item.description?.replaceAll("\n", " · ") || "Описание не указано"}</p></td>
                <td className="whitespace-nowrap px-5 py-4 text-right font-semibold tabular-nums text-slate-950">{money.format(item.sum)}</td>
                <td className="px-5 py-4 text-center"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${item.isPosted ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{item.isPosted ? "Проведён" : "Черновик"}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
