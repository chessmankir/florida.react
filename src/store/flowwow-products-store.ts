export type FlowwowProductsQuery = {
  search: string;
  shopId: string;
  status: "all" | "active" | "hidden" | "archived";
  linkStatus: "all" | "linked" | "unlinked";
  availability: "all" | "in_stock" | "out_of_stock";
  sortBy: "sales" | "stock" | "views" | "profit";
  sortDirection: "asc" | "desc";
  page: number;
  limit: number;
};

export type FlowwowProductStats = {
  purchase: number;
  addToCart: number;
  itemViews: number;
  catalogViews: number;
  productSales: number;
  conversionAll: number;
};

export type FlowwowProduct = {
  shopId: string;
  productId: string;
  offerId: string;
  name: string;
  description: string;
  url: string;
  imageUrl: string | null;
  price: number;
  currencyCode: string;
  stock: number;
  availableToAssemble: number | null;
  available: boolean;
  isActive: boolean;
  isArchived: boolean;
  discount: number;
  productionTime: number;
  bundleId: string | null;
  profitAmount: number | null;
  stats: FlowwowProductStats;
};

export type FlowwowProductsResponse = {
  shops: Array<{ id: string; name: string; address: string | null }>;
  items: FlowwowProduct[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
};

type ApiRecord = Record<string, unknown>;
type State = {
  data: FlowwowProductsResponse | null;
  isLoading: boolean;
  error: string | null;
  requestKey: string | null;
};

export const defaultFlowwowProductsQuery: FlowwowProductsQuery = {
  search: "",
  shopId: "191599",
  status: "active",
  linkStatus: "all",
  availability: "all",
  sortBy: "sales",
  sortDirection: "desc",
  page: 1,
  limit: 50,
};

const initialState: State = { data: null, isLoading: true, error: null, requestKey: null };
let state = initialState;
let activeRequest: AbortController | null = null;
const listeners = new Set<() => void>();

function emit(nextState: State) {
  state = nextState;
  listeners.forEach((listener) => listener());
}

function object(value: unknown): ApiRecord {
  return value && typeof value === "object" ? value as ApiRecord : {};
}

function numeric(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalize(raw: ApiRecord): FlowwowProductsResponse {
  const items = (Array.isArray(raw.items) ? raw.items : []).map((value) => {
    const item = object(value);
    const stats = object(item.stats);
    const images = Array.isArray(item.images) ? item.images : [];
    return {
      shopId: String(item.shopId ?? ""),
      productId: String(item.productId ?? item.id ?? ""),
      offerId: String(item.offerId ?? ""),
      name: String(item.name ?? "Без названия"),
      description: String(item.description ?? ""),
      url: String(item.url ?? ""),
      imageUrl: images[0] ? String(images[0]) : null,
      price: numeric(item.price),
      currencyCode: String(item.currencyCode ?? "RUB"),
      stock: numeric(item.stock),
      availableToAssemble: item.availableToAssemble === null || item.availableToAssemble === undefined
        ? null
        : numeric(item.availableToAssemble),
      available: Boolean(item.available),
      isActive: Boolean(item.isActive),
      isArchived: Boolean(item.isArchived),
      discount: numeric(item.discount),
      productionTime: numeric(item.productionTime),
      bundleId: item.bundleId ? String(item.bundleId) : null,
      profitAmount: item.profitAmount === null || item.profitAmount === undefined
        ? null
        : numeric(item.profitAmount),
      stats: {
        purchase: numeric(stats.purchase),
        addToCart: numeric(stats.addToCart),
        itemViews: numeric(stats.itemViews),
        catalogViews: numeric(stats.catalogViews),
        productSales: numeric(stats.productSales),
        conversionAll: numeric(stats.conversionAll),
      },
    } satisfies FlowwowProduct;
  });
  const pagination = object(raw.pagination);
  const shops = (Array.isArray(raw.shops) ? raw.shops : []).map((value) => {
    const shop = object(value);
    const id = String(shop.shopId ?? shop.id ?? "");
    return {
      id,
      name: String(shop.name ?? id),
      address: shop.address ? String(shop.address) : null,
    };
  }).filter((shop) => shop.id);
  return {
    shops,
    items,
    pagination: {
      page: numeric(pagination.page) || 1,
      limit: numeric(pagination.limit) || 50,
      total: numeric(pagination.total),
      totalPages: numeric(pagination.totalPages) || 1,
    },
  };
}

export const flowwowProductsStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot() { return state; },
  getServerSnapshot() { return initialState; },
  async load(query: FlowwowProductsQuery, force = false) {
    const params = new URLSearchParams({
      shopId: query.shopId,
      status: query.status,
      linkStatus: query.linkStatus,
      availability: query.availability,
      sortBy: query.sortBy,
      sortDirection: query.sortDirection,
      page: String(query.page),
      limit: String(query.limit),
    });
    if (query.search) params.set("search", query.search);
    const requestKey = params.toString();
    if (!force && state.requestKey === requestKey && (state.isLoading || state.data)) return;

    activeRequest?.abort();
    activeRequest = new AbortController();
    emit({ ...state, isLoading: true, error: null, requestKey });
    try {
      const response = await fetch(`/api/analytics/flowwow/products?${requestKey}`, {
        signal: activeRequest.signal,
        cache: "no-store",
      });
      if (!response.ok) throw new Error(`API вернул ошибку ${response.status}`);
      emit({ data: normalize(object(await response.json())), isLoading: false, error: null, requestKey });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      emit({
        ...state,
        isLoading: false,
        error: error instanceof Error ? error.message : "Не удалось загрузить товары Flowwow",
        requestKey,
      });
    }
  },
  async changeVisibility(product: FlowwowProduct, makeActive: boolean) {
    if (!product.offerId) throw new Error("У товара отсутствует offerId");
    const action = makeActive ? "unhide" : "hide";
    const response = await fetch(
      `/api/analytics/flowwow/products/${action}?shopId=${encodeURIComponent(product.shopId)}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ offers: [{ offerId: product.offerId }] }),
      },
    );
    if (!response.ok) {
      const payload = await response.json().catch(() => null) as { message?: string } | null;
      throw new Error(payload?.message || `API вернул ошибку ${response.status}`);
    }
  },
};
