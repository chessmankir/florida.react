import { Suspense } from "react";
import { FlowwowProductsAnalytics } from "@/components/FlowwowProductsAnalytics";

export default function FlowwowProductsPage() {
  return (
    <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-white" />}>
      <FlowwowProductsAnalytics />
    </Suspense>
  );
}
