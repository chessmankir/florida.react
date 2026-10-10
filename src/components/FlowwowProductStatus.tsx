import { FlowwowProduct } from "@/store/flowwow-products-store";

export function FlowwowProductStatus({ product }: { product: FlowwowProduct }) {
  const label = product.isArchived ? "В архиве" : product.isActive ? "Активен" : "Скрыт";
  const color = product.isArchived
    ? "bg-slate-100 text-slate-600"
    : product.isActive
      ? "bg-emerald-100 text-emerald-700"
      : "bg-amber-100 text-amber-700";
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${color}`}>{label}</span>;
}
