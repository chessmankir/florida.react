import { MetricCard } from "@/components/MetricCard";
import { ExpensesResponse } from "@/store/expenses-store";

type ExpensesSummaryProps = {
  data: ExpensesResponse | null;
  dateFrom: string;
  dateTo: string;
};

const money = new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", notation: "compact", maximumFractionDigits: 1 });
const number = new Intl.NumberFormat("ru-RU");

export function ExpensesSummary({ data, dateFrom, dateTo }: ExpensesSummaryProps) {
  return (
    <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard label="Всего расходов" value={data ? money.format(data.summary.total) : "—"} note={`${dateFrom} — ${dateTo}`} accent />
      <MetricCard label="Безналичные списания" value={data ? money.format(data.summary.paymentOut) : "—"} note="Движение по счетам" />
      <MetricCard label="Расходы наличными" value={data ? money.format(data.summary.cashOut) : "—"} note="Движение по кассе" />
      <MetricCard label="Операций" value={data ? number.format(data.summary.paymentsCount) : "—"} note="Проведённых платежей" />
    </div>
  );
}
