export type InventoryBundle = {
  id: string;
  name: string;
  buyPriceMinor: number | null;
  salePriceMinor: number | null;
  stockCostMinor: number | null;
};

export type BundleComponent = {
  id: string;
  name: string;
  quantity: number;
  unitCostMinor: number | null;
  totalCostMinor: number;
};

export type BundleCalculation = {
  components: BundleComponent[];
  totalCost: number;
  flowwowExpenses: number;
  profit: number;
};

type ApiRecord = Record<string, unknown>;

function object(value: unknown): ApiRecord {
  return value && typeof value === "object" ? value as ApiRecord : {};
}

function bundle(value: unknown): InventoryBundle | null {
  if (!value) return null;
  const item = object(value);
  const id = String(item.id ?? "");
  if (!id) return null;
  return {
    id,
    name: String(item.name ?? "Без названия"),
    buyPriceMinor: item.buyPriceMinor == null ? null : Number(item.buyPriceMinor),
    salePriceMinor: item.salePriceMinor == null ? null : Number(item.salePriceMinor),
    stockCostMinor: item.stockCostMinor == null ? null : Number(item.stockCostMinor),
  };
}

async function json(response: Response) {
  const text = await response.text();
  if (!response.ok) throw new Error(`API вернул ошибку ${response.status}`);
  return text ? JSON.parse(text) : null;
}

export const flowwowProductLinksStore = {
  async searchInventory(search: string, signal?: AbortSignal): Promise<InventoryBundle[]> {
    const params = new URLSearchParams({ page: "1", limit: "10" });
    if (search.trim()) params.set("search", search.trim());
    const raw = object(await json(await fetch(`/api/analytics/moysklad/processing-plans?${params}`, { cache: "no-store", signal })));
    return (Array.isArray(raw.items) ? raw.items : []).map(bundle).filter((item): item is InventoryBundle => item !== null);
  },

  async load(shopId: string, productId: string): Promise<InventoryBundle | null> {
    const params = new URLSearchParams({ shopId, productId });
    return bundle(await json(await fetch(`/api/analytics/flowwow/products/links?${params}`, { cache: "no-store" })));
  },

  async save(shopId: string, productId: string, bundleId: string): Promise<InventoryBundle> {
    const raw = object(await json(await fetch("/api/analytics/flowwow/products/links", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ shopId: Number(shopId), productId: Number(productId), processingPlanId: bundleId }),
    })));
    const saved = bundle(raw.bundle);
    if (!saved) throw new Error("API не вернул сохранённую техкарту");
    return saved;
  },

  async remove(shopId: string, productId: string): Promise<void> {
    const params = new URLSearchParams({ shopId, productId });
    await json(await fetch(`/api/analytics/flowwow/products/links?${params}`, {
      method: "DELETE",
    }));
  },

  async calculate(bundleId: string, flowwowPrice: number): Promise<BundleCalculation> {
    const [componentsRaw, commissionRaw] = await Promise.all([
      json(await fetch(`/api/analytics/moysklad/processing-plans/${encodeURIComponent(bundleId)}/materials`, { cache: "no-store" })),
      json(await fetch("/api/analytics/flowwow/commission/calculate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ price: flowwowPrice }),
      })),
    ]);
    const componentsSource = object(componentsRaw);
    const commission = object(commissionRaw);
    const components = (Array.isArray(componentsSource.items) ? componentsSource.items : []).map((value) => {
      const item = object(value);
      return {
        id: String(item.componentId ?? item.assortmentId ?? ""),
        name: String(item.name ?? "Без названия"),
        quantity: Number(item.quantity) || 0,
        unitCostMinor: item.unitCostMinor == null ? null : Number(item.unitCostMinor),
        totalCostMinor: Number(item.totalCostMinor) || 0,
      } satisfies BundleComponent;
    });
    const totalCost = Number(componentsSource.totalCostMinor ?? 0) / 100;
    const flowwowExpenses = Number(commission.flowwowExpenses ?? 0);
    return { components, totalCost, flowwowExpenses, profit: flowwowPrice - totalCost - flowwowExpenses };
  },
};
