"use client";

import { useState } from "react";
import { FlowwowProduct } from "@/store/flowwow-products-store";

type Props = {
  product: FlowwowProduct;
  onChange: (product: FlowwowProduct, makeActive: boolean) => Promise<void>;
};

export function FlowwowProductVisibilityToggle({ product, onChange }: Props) {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const disabled = isSaving || product.isArchived || !product.offerId;
  const title = product.isArchived
    ? "Архивный товар нельзя показать"
    : !product.offerId
      ? "У товара отсутствует offerId"
      : product.isActive
        ? "Скрыть товар"
        : "Показать товар";

  async function toggle() {
    if (disabled) return;
    setIsSaving(true);
    setError(null);
    try {
      await onChange(product, !product.isActive);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Не удалось изменить активность");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="relative inline-flex">
      <button
        type="button"
        role="switch"
        aria-checked={product.isActive}
        aria-label={title}
        title={error ?? title}
        disabled={disabled}
        className={`relative h-6 w-10 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-45 ${product.isActive ? "bg-emerald-500" : "bg-slate-300"}`}
        onClick={toggle}
      >
        <span className={`absolute left-1 top-1 size-4 rounded-full bg-white shadow-sm transition-transform ${product.isActive ? "translate-x-4" : "translate-x-0"}`} />
      </button>
      {isSaving && <span className="absolute -right-1 -top-1 size-2 animate-pulse rounded-full bg-amber-500" />}
    </div>
  );
}
