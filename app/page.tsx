import { redirect } from "next/navigation";
import { getCurrentMonthRange } from "@/lib/date-range";

export default function Home() {
  const period = getCurrentMonthRange();
  redirect(`/analytics/flowwow/orders?dateFrom=${period.dateFrom}&dateTo=${period.dateTo}&page=1&limit=50`);
}
