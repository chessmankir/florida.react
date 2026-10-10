import { FlowwowProductImage } from "@/components/FlowwowProductImage";
import { FlowwowProductStatus } from "@/components/FlowwowProductStatus";
import { FlowwowProductVisibilityToggle } from "@/components/FlowwowProductVisibilityToggle";
import { FlowwowProduct } from "@/store/flowwow-products-store";

const money = new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 });

type Props = {
  products: FlowwowProduct[];
  pending: boolean;
  onVisibilityChange: (product: FlowwowProduct, makeActive: boolean) => Promise<void>;
};

export function FlowwowProductsList({ products, pending, onVisibilityChange }: Props) {
  return (
    <div className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-opacity ${pending ? "opacity-60" : "opacity-100"}`}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[950px] border-collapse text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3.5 text-left font-semibold">Товар</th><th className="px-5 py-3.5 text-left font-semibold">Статус</th><th className="px-5 py-3.5 text-right font-semibold">Цена</th><th className="px-5 py-3.5 text-right font-semibold">Остаток</th><th className="px-5 py-3.5 text-right font-semibold">Просмотры</th><th className="px-5 py-3.5 text-right font-semibold">Выручка</th></tr></thead>
          <tbody className="divide-y divide-slate-100">{products.map((product) => <tr key={`${product.shopId}-${product.productId}`} className="hover:bg-slate-50/80"><td className="px-5 py-3"><div className="flex items-center gap-3"><a href={product.url || undefined} target="_blank" rel="noreferrer" className="shrink-0"><FlowwowProductImage src={product.imageUrl} alt={product.name} className="size-14 rounded-xl" /></a><div><a href={product.url || undefined} target="_blank" rel="noreferrer" className="font-semibold text-slate-900 hover:text-emerald-700">{product.name}</a><p className="mt-1 text-xs text-slate-400">ID {product.productId}</p></div></div></td><td className="px-5 py-3"><div className="flex items-center gap-2"><FlowwowProductStatus product={product} /><FlowwowProductVisibilityToggle product={product} onChange={onVisibilityChange} /></div></td><td className="whitespace-nowrap px-5 py-3 text-right font-semibold text-slate-950">{money.format(product.price)}</td><td className="px-5 py-3 text-right tabular-nums text-slate-600">{product.stock}</td><td className="px-5 py-3 text-right tabular-nums text-slate-600">{product.stats.itemViews}</td><td className="px-5 py-3 text-right tabular-nums font-semibold text-slate-900">{money.format(product.stats.productSales)}</td></tr>)}</tbody>
        </table>
      </div>
      {!pending && products.length === 0 && <div className="px-6 py-14 text-center text-sm text-slate-500">Товары не найдены</div>}
    </div>
  );
}
