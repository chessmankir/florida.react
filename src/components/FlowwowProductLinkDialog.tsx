"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { MoyskladSelectedBundle } from "@/components/MoyskladSelectedBundle";
import { useFlowwowProductLinks } from "@/hooks/useFlowwowProductLinks";
import { FlowwowProduct } from "@/store/flowwow-products-store";

export function FlowwowProductLinkDialog({ product, open, onClose, onLinkedChange }: { product: FlowwowProduct; open: boolean; onClose: () => void; onLinkedChange: (linked: boolean) => void }) {
  const state = useFlowwowProductLinks(product.shopId, product.productId, product.name, product.price, open);
  const [areResultsVisible, setAreResultsVisible] = useState(!product.bundleId);
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
        <div className="mb-5 flex items-start justify-between gap-4"><div><h2 id="product-link-title" className="text-xl font-bold text-slate-950">Привязка техкарты</h2><p className="mt-1 line-clamp-1 text-sm text-slate-500">{product.name}</p></div><button type="button" aria-label="Закрыть" className="grid size-9 place-items-center rounded-lg text-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700" onClick={onClose}>×</button></div>
        <label className="grid gap-1.5 text-xs font-semibold text-slate-500">Поиск по МоемуСкладу<input autoFocus value={state.search} onChange={(event) => { state.setSearch(event.target.value); setAreResultsVisible(true); }} placeholder="Например, роза" className="h-11 rounded-xl border border-slate-200 px-3 text-sm font-normal text-slate-900 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10" /></label>
        <div className="mt-2 flex justify-end"><button type="button" aria-expanded={areResultsVisible} className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-50" onClick={() => setAreResultsVisible((value) => !value)}>{areResultsVisible ? "Скрыть варианты" : "Показать варианты"}<svg className={`size-3.5 transition-transform ${areResultsVisible ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m5 8 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></button></div>
        {areResultsVisible && <div className="mt-2 grid max-h-56 gap-1.5 overflow-y-auto" aria-label="Найденные техкарты">
          {state.options.map((item, index) => <button key={item.id} type="button" disabled={state.saving} className={`rounded-xl border px-3 py-2.5 text-left text-sm transition disabled:cursor-wait disabled:opacity-60 ${state.selected?.id === item.id ? "border-emerald-500 bg-emerald-50 font-semibold text-emerald-800" : "border-slate-200 text-slate-700 hover:border-emerald-300 hover:bg-slate-50"}`} onClick={async () => { if (await state.choose(item.id)) { onLinkedChange(true); setAreResultsVisible(false); } }}><span className="mr-2 text-xs text-slate-400">{index + 1}.</span>{item.name}</button>)}
          {!state.pending && state.options.length === 0 && <p className="rounded-xl bg-slate-50 px-4 py-4 text-center text-sm text-slate-500">Техкарты не найдены</p>}
        </div>}
        <div className="my-5 border-t border-slate-100" />
        <h3 className="mb-3 text-sm font-bold text-slate-900">Выбранная техкарта</h3>
        <MoyskladSelectedBundle key={state.selected?.id ?? "empty"} bundle={state.selected} calculation={state.calculation} flowwowPrice={product.price} pending={state.calculationPending} />
        {state.error && <p className="mt-3 text-sm text-red-600">{state.error}</p>}
        <div className="mt-5 flex justify-end"><button type="button" disabled={state.saving || !state.selected} className="h-10 rounded-xl border border-red-200 px-4 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40" onClick={async () => { if (await state.remove()) { onLinkedChange(false); setAreResultsVisible(true); } }}>{state.saving ? "Обработка…" : "Отвязать"}</button></div>
      </div>
    </div>,
    document.body,
  );
}
