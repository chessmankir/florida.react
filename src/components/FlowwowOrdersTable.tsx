import { FlowwowOrder } from "@/store/flowwow-orders-store";

type Props = { items: FlowwowOrder[]; pending: boolean };
const money = new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 });
const dateTime = new Intl.DateTimeFormat("ru-RU", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Moscow" });
const statusLabels: Record<string, string> = { "1": "Новый", "2": "Принят", "3": "Завершён", "4": "В доставке", "5": "Фото загружено", "7": "Ожидает выдачи", paid: "Оплачен", cancelled: "Отменён", finished: "Завершён" };
function formatDate(value: string | number | null) {
  if (!value) return "—";
  const date = typeof value === "number" || /^\d{10}$/.test(String(value)) ? new Date(Number(value) * 1000) : new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : dateTime.format(date);
}

export function FlowwowOrdersTable({ items, pending }: Props) {
  return (
    <div className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-opacity ${pending ? "opacity-60" : "opacity-100"}`}>
      <div className="overflow-x-auto"><table className="w-full min-w-[1050px] border-collapse text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3.5 text-left font-semibold">Заказ</th><th className="px-5 py-3.5 text-left font-semibold">Дата</th><th className="px-5 py-3.5 text-left font-semibold">Магазин</th><th className="px-5 py-3.5 text-left font-semibold">Товары</th><th className="px-5 py-3.5 text-right font-semibold">Сумма</th><th className="px-5 py-3.5 text-right font-semibold">Комиссия</th><th className="px-5 py-3.5 text-center font-semibold">Статус</th></tr></thead>
        <tbody className="divide-y divide-slate-100">{items.map((item) => <tr key={`${item.shopId}-${item.id}`} className="hover:bg-slate-50/80"><td className="px-5 py-4 font-mono text-xs font-semibold text-slate-900">№ {item.id}</td><td className="whitespace-nowrap px-5 py-4 text-slate-600">{formatDate(item.deliveryAt || item.createdAt)}</td><td className="px-5 py-4 font-medium text-slate-800">{item.shopName}</td><td className="max-w-[360px] px-5 py-4"><p className="truncate text-slate-600" title={item.products.join(", ")}>{item.products.length ? item.products.join(", ") : item.productsCount > 0 ? `${item.productsCount} поз.` : "—"}</p></td><td className="whitespace-nowrap px-5 py-4 text-right font-semibold tabular-nums text-slate-950">{money.format(item.price)}</td><td className="whitespace-nowrap px-5 py-4 text-right font-semibold tabular-nums text-amber-700">{money.format(item.commission)}</td><td className="px-5 py-4 text-center"><span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">{statusLabels[String(item.status)] ?? String(item.status)}</span></td></tr>)}</tbody>
      </table></div>
      {!pending && items.length === 0 && <div className="px-6 py-14 text-center text-sm text-slate-500">За выбранный период заказов нет</div>}
    </div>
  );
}
