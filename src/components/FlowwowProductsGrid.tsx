import { FlowwowProductCard } from "@/components/FlowwowProductCard";
import { FlowwowProduct } from "@/store/flowwow-products-store";

type Props = {
  products: FlowwowProduct[];
  pending: boolean;
  onVisibilityChange: (product: FlowwowProduct, makeActive: boolean) => Promise<void>;
};

export function FlowwowProductsGrid({ products, pending, onVisibilityChange }: Props) {
  if (!pending && products.length === 0) return <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center text-sm text-slate-500">Товары не найдены</div>;
  return <div className={`grid gap-4 transition-opacity sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 ${pending ? "opacity-60" : "opacity-100"}`}>{products.map((product) => <FlowwowProductCard key={`${product.shopId}-${product.productId}`} product={product} onVisibilityChange={onVisibilityChange} />)}</div>;
}
