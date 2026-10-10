"use client";

import { useCallback, useEffect, useState } from "react";
import { flowwowProductLinksStore, InventoryProduct } from "@/store/flowwow-product-links-store";

export function useFlowwowProductLinks(shopId: string, productId: string, open: boolean) {
  const [search, setSearch] = useState("");
  const [options, setOptions] = useState<InventoryProduct[]>([]);
  const [selected, setSelected] = useState<InventoryProduct[]>([]);
  const [pending, setPending] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setPending(true);
    setError(null);
    void flowwowProductLinksStore.load(shopId, productId)
      .then(setSelected)
      .catch((reason) => setError(reason instanceof Error ? reason.message : "Не удалось загрузить привязки"))
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

  const add = useCallback((id: string) => {
    const item = options.find((option) => option.id === id);
    if (item) setSelected((current) => {
      const existing = current.find((value) => value.id === id);
      return existing
        ? current.map((value) => value.id === id ? { ...value, quantity: value.quantity + 1 } : value)
        : [...current, { ...item, quantity: 1 }];
    });
  }, [options]);

  const remove = useCallback((id: string) => setSelected((current) => current.filter((item) => item.id !== id)), []);
  const changeQuantity = useCallback((id: string, delta: number) => {
    setSelected((current) => current.map((item) => item.id === id
      ? { ...item, quantity: Math.max(1, item.quantity + delta) }
      : item));
  }, []);

  const save = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      setSelected(await flowwowProductLinksStore.save(shopId, productId, selected));
      return true;
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Не удалось сохранить привязки");
      return false;
    } finally {
      setSaving(false);
    }
  }, [productId, selected, shopId]);

  return { search, setSearch, options, selected, pending, saving, error, add, remove, changeQuantity, save };
}
