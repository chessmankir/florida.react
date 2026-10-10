export type InventoryProduct = {
  id: string;
  name: string;
  buyPriceMinor: number | null;
  salePriceMinor: number | null;
  quantity: number;
};

type ApiRecord = Record<string, unknown>;

function object(value: unknown): ApiRecord {
  return value && typeof value === "object" ? value as ApiRecord : {};
}

function product(value: unknown): InventoryProduct {
  const item = object(value);
  return {
    id: String(item.id ?? ""),
    name: String(item.name ?? "Без названия"),
    buyPriceMinor: item.buyPriceMinor == null ? null : Number(item.buyPriceMinor),
    salePriceMinor: item.salePriceMinor == null ? null : Number(item.salePriceMinor),
    quantity: Math.max(1, Number(item.quantity) || 1),
  };
}

async function json(response: Response) {
  if (!response.ok) throw new Error(`API вернул ошибку ${response.status}`);
  return response.json();
}

export const flowwowProductLinksStore = {
  async searchInventory(search: string, signal?: AbortSignal): Promise<InventoryProduct[]> {
    const params = new URLSearchParams({ page: "1", limit: "20", archived: "false", sortBy: "name", sortDirection: "asc" });
    if (search.trim()) params.set("search", search.trim());
    const raw = object(await json(await fetch(`/api/analytics/moysklad/inventory?${params}`, { cache: "no-store", signal })));
    return (Array.isArray(raw.items) ? raw.items : []).map(product).filter((item) => item.id);
  },

  async load(shopId: string, productId: string): Promise<InventoryProduct[]> {
    const params = new URLSearchParams({ shopId, productId });
    const raw = await json(await fetch(`/api/analytics/flowwow/products/links?${params}`, { cache: "no-store" }));
    return (Array.isArray(raw) ? raw : []).map(product).filter((item) => item.id);
  },

  async save(shopId: string, productId: string, items: InventoryProduct[]): Promise<InventoryProduct[]> {
    const raw = object(await json(await fetch("/api/analytics/flowwow/products/links", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        shopId: Number(shopId),
        productId: Number(productId),
        items: items.map((item) => ({ id: item.id, quantity: item.quantity })),
      }),
    })));
    return (Array.isArray(raw.items) ? raw.items : []).map(product).filter((item) => item.id);
  },
};
