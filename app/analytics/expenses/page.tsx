import { Suspense } from "react";
import { ExpensesAnalytics } from "@/components/ExpensesAnalytics";

export default function ExpensesPage() {
  return (
    <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-white" />}>
      <ExpensesAnalytics />
    </Suspense>
  );
}
