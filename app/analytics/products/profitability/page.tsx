import { Suspense } from "react";
import { ProductsAnalytics } from "@/components/ProductsAnalytics";

export default function ProductProfitabilityPage() {
  return (
    <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-white" />}>
      <ProductsAnalytics />
    </Suspense>
  );
}
