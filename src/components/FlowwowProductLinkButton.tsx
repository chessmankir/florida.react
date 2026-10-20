"use client";

import { useState } from "react";
import { FlowwowProductLinkDialog } from "@/components/FlowwowProductLinkDialog";
import { FlowwowProduct } from "@/store/flowwow-products-store";

export function FlowwowProductLinkButton({ product }: { product: FlowwowProduct }) {
  const [open, setOpen] = useState(false);
  const [linked, setLinked] = useState(Boolean(product.bundleId));
  const label = linked ? "Изменить привязанную техкарту" : "Привязать техкарту из МоегоСклада";
  return <><button type="button" title={label} aria-label={label} className={`absolute right-3 top-3 z-10 grid size-9 place-items-center rounded-full border shadow-md transition ${linked ? "border-emerald-300 bg-emerald-500 text-white hover:bg-emerald-600" : "border-white/70 bg-white/95 text-slate-700 hover:bg-white hover:text-emerald-700"}`} onClick={() => setOpen(true)}>{linked ? <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden="true"><path d="m5 12.5 4.2 4.2L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg> : <svg viewBox="0 0 24 24" fill="none" className="size-4" aria-hidden="true"><path d="m4 20 4.2-1 10.5-10.5a2.1 2.1 0 0 0-3-3L5.2 16 4 20Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="m13.8 7.4 2.8 2.8" stroke="currentColor" strokeWidth="1.8"/></svg>}</button><FlowwowProductLinkDialog product={product} open={open} onClose={() => setOpen(false)} onLinkedChange={setLinked} /></>;
}
