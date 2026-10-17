"use client";

import { useCallback, useEffect, useState } from "react";
import { BundleCalculation, flowwowProductLinksStore, InventoryBundle } from "@/store/flowwow-product-links-store";

export function useFlowwowProductLinks(shopId: string, productId: string, flowwowPrice: number, open: boolean) {
  const [search, setSearch] = useState("");
  const [options, setOptions] = useState<InventoryBundle[]>([]);
  const [selected, setSelected] = useState<InventoryBundle | null>(null);
  const [pending, setPending] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [calculation, setCalculation] = useState<BundleCalculation | null>(null);
  const [calculationPending, setCalculationPending] = useState(false);

  useEffect(() => {
    if (!open) return;
    setPending(true);
    setError(null);
    void flowwowProductLinksStore.load(shopId, productId)
      .then(setSelected)
      .catch((reason) => setError(reason instanceof Error ? reason.message : "Не удалось загрузить привязку"))
      .finally(() => setPending(false));
  }, [open, productId, shopId]);

  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => {
      void flowwowProductLinksStore.searchInventory(search, controller.signal)
        .then(setOptions)
        .catch((reason) => {
          if (!(reason instanceof DOMException && reason.name === "AbortError")) setError("Не удалось выполнить поиск");
        });
    }, 300);
    return () => { window.clearTimeout(timeout); controller.abort(); };
  }, [open, search]);

  useEffect(() => {
    if (!open || !selected) { setCalculation(null); return; }
    let active = true;
    setCalculationPending(true);
    void flowwowProductLinksStore.calculate(selected.id, flowwowPrice)
      .then((value) => { if (active) setCalculation(value); })
      .catch((reason) => { if (active) setError(reason instanceof Error ? reason.message : "Не удалось рассчитать букет"); })
      .finally(() => { if (active) setCalculationPending(false); });
    return () => { active = false; };
  }, [flowwowPrice, open, selected]);

  const choose = useCallback(async (bundleId: string) => {
    const item = options.find((option) => option.id === bundleId);
    if (!item) return false;
    setSaving(true);
    setError(null);
    try {
      setSelected(await flowwowProductLinksStore.save(shopId, productId, item.id));
      return true;
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Не удалось сохранить привязку");
      return false;
    } finally {
      setSaving(false);
    }
  }, [options, productId, shopId]);

  const remove = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      await flowwowProductLinksStore.remove(shopId, productId);
      setSelected(null);
      setCalculation(null);
      return true;
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Не удалось отвязать букет");
      return false;
    } finally {
      setSaving(false);
    }
  }, [productId, shopId]);

  return { search, setSearch, options, selected, pending, saving, error, calculation, calculationPending, choose, remove };
}
