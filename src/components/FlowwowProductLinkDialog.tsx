"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { MoyskladLinkedProductList } from "@/components/MoyskladLinkedProductList";
import { useFlowwowProductLinks } from "@/hooks/useFlowwowProductLinks";
import { FlowwowProduct } from "@/store/flowwow-products-store";

export function FlowwowProductLinkDialog({ product, open, onClose }: { product: FlowwowProduct; open: boolean; onClose: () => void }) {
  const state = useFlowwowProductLinks(product.shopId, product.productId, open);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [onClose, open]);
  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4" onMouseDown={(event) => { if (event.currentTarget === event.target) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-labelledby="product-link-title" className="w-full max-w-xl rounded-2xl bg-white p-5 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4"><div><h2 id="product-link-title" className="text-xl font-bold text-slate-950">Состав товара</h2><p className="mt-1 line-clamp-1 text-sm text-slate-500">{product.name}</p></div><button type="button" aria-label="Закрыть" className="grid size-9 place-items-center rounded-lg text-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700" onClick={onClose}>×</button></div>
        <label className="grid gap-1.5 text-xs font-semibold text-slate-500">Поиск по МоемуСкладу<input autoFocus value={state.search} onChange={(event) => state.setSearch(event.target.value)} placeholder="Например, роза" className="h-11 rounded-xl border border-slate-200 px-3 text-sm font-normal text-slate-900 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10" /></label>
        <label className="mt-3 grid gap-1.5 text-xs font-semibold text-slate-500">Добавить товар<select value="" disabled={state.pending} onChange={(event) => state.add(event.target.value)} className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-normal text-slate-900 outline-none focus:border-emerald-500"><option value="">Выберите товар</option>{state.options.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
        <div className="my-5 border-t border-slate-100" />
        <h3 className="mb-3 text-sm font-bold text-slate-900">Прикреплённые товары</h3>
        <MoyskladLinkedProductList items={state.selected} onRemove={state.remove} onChangeQuantity={state.changeQuantity} />
        {state.error && <p className="mt-3 text-sm text-red-600">{state.error}</p>}
        <div className="mt-5 flex justify-end gap-2"><button type="button" className="h-10 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50" onClick={onClose}>Отмена</button><button type="button" disabled={state.saving} className="h-10 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60" onClick={async () => { if (await state.save()) onClose(); }}>{state.saving ? "Сохранение…" : "Сохранить"}</button></div>
      </div>
    </div>,
    document.body,
  );
}
