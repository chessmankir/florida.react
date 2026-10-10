import { FlowwowProductImage } from "@/components/FlowwowProductImage";
import { FlowwowProductStatus } from "@/components/FlowwowProductStatus";
import { FlowwowProductVisibilityToggle } from "@/components/FlowwowProductVisibilityToggle";
import { FlowwowProductLinkButton } from "@/components/FlowwowProductLinkButton";
import { FlowwowProduct } from "@/store/flowwow-products-store";

const money = new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 });

type Props = {
  product: FlowwowProduct;
  onVisibilityChange: (product: FlowwowProduct, makeActive: boolean) => Promise<void>;
};

export function FlowwowProductCard({ product, onVisibilityChange }: Props) {
  return (
    <article className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <FlowwowProductLinkButton product={product} />
      <a href={product.url || undefined} target="_blank" rel="noreferrer" className="block">
        <FlowwowProductImage src={product.imageUrl} alt={product.name} className="aspect-square w-full" />
      </a>
      <div className="p-4">
        <div className="mb-3 flex items-start gap-3">
          <div className="flex items-center gap-2"><FlowwowProductStatus product={product} /><FlowwowProductVisibilityToggle product={product} onChange={onVisibilityChange} /></div>
        </div>
        <a href={product.url || undefined} target="_blank" rel="noreferrer" className="line-clamp-2 min-h-10 text-sm font-semibold text-slate-950 hover:text-emerald-700">{product.name}</a>
        <div className="mt-4 flex items-end justify-between gap-3">
          <div><p className="text-lg font-bold text-slate-950">{money.format(product.price)}</p><p className="mt-0.5 text-xs text-slate-400">Остаток: {product.stock}</p></div>
          <div className="text-right text-xs text-slate-500"><p>{product.stats.itemViews} просмотров</p><p>{money.format(product.stats.productSales)} выручка</p></div>
        </div>
      </div>
    </article>
  );
}
