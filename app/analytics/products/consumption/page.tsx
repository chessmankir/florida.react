import { Suspense } from "react";
import { ProductConsumption } from "@/components/ProductConsumption";
export default function ProductConsumptionPage() { return <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-white" />}><ProductConsumption /></Suspense>; }
