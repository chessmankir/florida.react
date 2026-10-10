import { Suspense } from "react";
import { FlowwowOrdersAnalytics } from "@/components/FlowwowOrdersAnalytics";

export default function FlowwowOrdersPage() {
  return (
    <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-white" />}>
      <FlowwowOrdersAnalytics />
    </Suspense>
  );
}
