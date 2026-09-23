import { ProductProfitability, ProductSortKey, ProductsQuery } from "@/store/products-store";

type ProductsTableProps = { products: ProductProfitability[]; query: ProductsQuery; pending: boolean; onSort: (key: ProductSortKey) => void };
const money = new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 });
const number = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 2 });

export function ProductsTable({ products, query, pending, onSort }: ProductsTableProps) {
  const sortableHeader = (label: string, key: ProductSortKey, right = false) => (
    <th className={`px-5 py-3.5 ${right ? "text-right" : "text-left"}`}><button type="button" className="inline-flex items-center gap-1.5 font-semibold hover:text-slate-950" onClick={() => onSort(key)}>{label}<span className={query.sortBy === key ? "text-emerald-600" : "text-slate-300"}>{query.sortBy === key ? (query.sortDirection === "desc" ? "↓" : "↑") : "↕"}</span></button></th>
  );
  return (
    <div className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-opacity ${pending ? "opacity-60" : "opacity-100"}`}>
      <div className="overflow-x-auto"><table className="w-full min-w-[900px] border-collapse text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr>{sortableHeader("Товар", "name")}<th className="px-5 py-3.5 text-left font-semibold">Тип</th>{sortableHeader("Продано", "soldQuantity", true)}{sortableHeader("Выручка", "revenue", true)}{sortableHeader("Себестоимость", "cost", true)}{sortableHeader("Валовая прибыль", "grossProfit", true)}{sortableHeader("Маржа", "marginPercent", true)}</tr></thead>
        <tbody className="divide-y divide-slate-100">{products.map((product) => (
          <tr key={product.productId} className="transition-colors hover:bg-slate-50/80">
            <td className="px-5 py-4"><p className="font-semibold text-slate-900">{product.name}</p><p className="mt-1 font-mono text-xs text-slate-400">{product.article || product.code}</p></td>
            <td className="px-5 py-4 text-slate-600">{product.productType === "service" ? "Услуга" : "Товар"}</td>
            <td className="px-5 py-4 text-right tabular-nums text-slate-700">{number.format(product.netSoldQuantity)}</td>
            <td className="px-5 py-4 text-right tabular-nums text-slate-700">{money.format(product.revenue)}</td>
            <td className="px-5 py-4 text-right tabular-nums text-slate-700">{money.format(product.cost)}</td>
            <td className="px-5 py-4 text-right font-semibold tabular-nums text-slate-950">{money.format(product.grossProfit)}</td>
            <td className="px-5 py-4 text-right"><span className={`inline-flex min-w-16 justify-center rounded-lg px-2.5 py-1 font-semibold ${product.marginPercent >= 30 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{product.marginPercent.toFixed(1)}%</span></td>
          </tr>
        ))}</tbody>
      </table></div>
    </div>
  );
}
