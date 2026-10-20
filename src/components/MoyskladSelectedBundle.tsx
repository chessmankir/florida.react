"use client";

import { useState } from "react";
import { BundleCalculation, InventoryBundle } from "@/store/flowwow-product-links-store";

const money = new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 2 });

export function MoyskladSelectedBundle({ bundle, calculation, flowwowPrice, pending }: { bundle: InventoryBundle | null; calculation: BundleCalculation | null; flowwowPrice: number; pending: boolean }) {
  const [isCompositionVisible, setIsCompositionVisible] = useState(true);
  if (!bundle) return <p className="rounded-xl bg-slate-50 px-4 py-5 text-center text-sm text-slate-500">Техкарта пока не выбрана</p>;

  return <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 px-4 py-3">
    <div className="flex items-center justify-between gap-3">
      <p className="text-sm font-semibold text-slate-950">{bundle.name}</p>
      {calculation && <button type="button" aria-expanded={isCompositionVisible} className="flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100" onClick={() => setIsCompositionVisible((value) => !value)}>{isCompositionVisible ? "Скрыть состав" : "Показать состав"}<svg className={`size-3.5 transition-transform ${isCompositionVisible ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m5 8 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg></button>}
    </div>
    {pending ? <p className="mt-3 text-xs text-slate-500">Рассчитываем состав и прибыль…</p> : calculation && <>
      {isCompositionVisible && <ul className="mt-3 max-h-64 divide-y divide-emerald-100 overflow-y-auto pr-1">{calculation.components.map((item) => {
        const unitCost = item.unitCostMinor ?? (item.quantity ? item.totalCostMinor / item.quantity : null);
        const totalCost = item.totalCostMinor || (unitCost == null ? 0 : unitCost * item.quantity);
        return <li key={item.id} className="flex items-start justify-between gap-3 py-2 text-xs"><span className="text-slate-700">{item.name}</span><span className="whitespace-nowrap font-medium text-slate-900">{unitCost == null ? "—" : `${item.quantity} × ${money.format(unitCost / 100)} = ${money.format(totalCost / 100)}`}</span></li>;
      })}</ul>}
      <dl className="mt-3 grid gap-2 border-t border-emerald-200 pt-3 text-sm"><div className="flex justify-between gap-4"><dt className="text-slate-600">Цена в Flowwow</dt><dd className="font-semibold text-slate-950">{money.format(flowwowPrice)}</dd></div><div className="flex justify-between gap-4"><dt className="text-slate-600">Себестоимость</dt><dd className="font-semibold text-slate-950">{money.format(calculation.totalCost)}</dd></div><div className="flex justify-between gap-4"><dt className="text-slate-600">Расходы Flowwow</dt><dd className="font-semibold text-amber-700">{money.format(calculation.flowwowExpenses)}</dd></div><div className="flex justify-between gap-4 border-t border-emerald-200 pt-2"><dt className="font-semibold text-slate-900">Прибыль</dt><dd className={`font-bold ${calculation.profit < 0 ? "text-red-600" : "text-emerald-700"}`}>{money.format(calculation.profit)}</dd></div></dl>
    </>}
  </div>;
}
