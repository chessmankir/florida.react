"use client";

import { useState } from "react";
import { FlowwowProductLinkDialog } from "@/components/FlowwowProductLinkDialog";
import { FlowwowProduct } from "@/store/flowwow-products-store";

export function FlowwowProductLinkButton({ product }: { product: FlowwowProduct }) {
  const [open, setOpen] = useState(false);
  return <><button type="button" title="Прикрепить товары из МоегоСклада" aria-label="Прикрепить товары из МоегоСклада" className="absolute right-3 top-3 z-10 grid size-9 place-items-center rounded-full border border-white/70 bg-white/95 text-slate-700 shadow-md transition hover:bg-white hover:text-emerald-700" onClick={() => setOpen(true)}><svg viewBox="0 0 24 24" fill="none" className="size-4" aria-hidden="true"><path d="m4 20 4.2-1 10.5-10.5a2.1 2.1 0 0 0-3-3L5.2 16 4 20Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="m13.8 7.4 2.8 2.8" stroke="currentColor" strokeWidth="1.8"/></svg></button><FlowwowProductLinkDialog product={product} open={open} onClose={() => setOpen(false)} /></>;
}
