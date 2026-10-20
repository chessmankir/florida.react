import { Suspense } from "react";
import { ProductsInventory } from "@/components/ProductsInventory";

export default function ProductsInventoryPage() {
  return <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-white" />}><ProductsInventory /></Suspense>;
}
