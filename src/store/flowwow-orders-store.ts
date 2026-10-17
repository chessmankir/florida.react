import { getCurrentMonthRange } from "@/lib/date-range";

export type FlowwowOrdersQuery = {
  dateFrom: string;
  dateTo: string;
  shopId: string;
  page: number;
  limit: number;
};

export type FlowwowShop = { id: string; name: string; address: string | null };

export type FlowwowOrder = {
  id: string;
  shopId: string;
  shopName: string;
  createdAt: string | number;
  deliveryAt: string | number | null;
  status: string | number;
  price: number;
  commission: number;
  costPrice: number | null;
  costPriceComplete: boolean;
  productsCount: number;
  products: string[];
};

export type FlowwowOrdersResponse = {
  items: FlowwowOrder[];
  shops: FlowwowShop[];
  total: number;
  totalPages: number;
  summary: { ordersCount: number; turnover: number; averageCheck: number; commissionExpenses: number };
};

type ApiRecord = Record<string, unknown>;
type FlowwowOrdersState = {
  data: FlowwowOrdersResponse | null;
  isLoading: boolean;
  error: string | null;
  requestKey: string | null;
};

export function getDefaultFlowwowOrdersQuery(): FlowwowOrdersQuery {
  return { ...getCurrentMonthRange(), shopId: "191599", page: 1, limit: 50 };
}

const initialState: FlowwowOrdersState = { data: null, isLoading: true, error: null, requestKey: null };
let state = initialState;
let activeRequest: AbortController | null = null;
const listeners = new Set<() => void>();

function emit(nextState: FlowwowOrdersState) {
  state = nextState;
  listeners.forEach((listener) => listener());
}

function numeric(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function money(record: ApiRecord, regularKeys: string[], minorKeys: string[]) {
  for (const key of regularKeys) if (record[key] != null) return numeric(record[key]);
  for (const key of minorKeys) if (record[key] != null) return numeric(record[key]) / 100;
  return 0;
}

function object(value: unknown): ApiRecord {
  return value && typeof value === "object" ? value as ApiRecord : {};
}

function array(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function normalize(raw: ApiRecord): FlowwowOrdersResponse {
  const items = array(raw.items ?? raw.orders).map((value) => {
    const item = object(value);
    const productRecords = array(item.products ?? item.positions).map(object);
    const shop = object(item.shop);
    const products = productRecords.map((product) => {
      const name = String(product.name ?? product.productName ?? "Товар");
      const quantity = numeric(product.quantity ?? product.count ?? 1);
      return quantity > 1 ? `${name} × ${quantity}` : name;
    });
    return {
      id: String(item.id ?? item.orderId ?? "—"),
      shopId: String(item.shopId ?? shop.id ?? ""),
      shopName: String(item.shopAddress ?? item.shopName ?? shop.address ?? shop.name ?? item.shopId ?? "—"),
      createdAt: item.createdAt as string ?? item.createdDate as number ?? item.created_at as string ?? "",
      deliveryAt: item.deliveryAt as string ?? item.deliveryDate as string ?? item.deliveryDateFrom as string ?? null,
      status: item.statusName as string ?? item.status as string | number ?? "—",
      price: money(item, ["grossProductAmount", "price", "total", "amount", "turnover"], ["priceMinor", "totalMinor", "amountMinor"]),
      commission: Math.abs(
        numeric(item.fixedCommissionAmount ?? item.fixedCommission ?? 0)
        + numeric(item.variableCommissionAmount ?? item.variableCommission ?? 0),
      ),
      costPrice: item.costPriceAmount == null ? null : numeric(item.costPriceAmount),
      costPriceComplete: Boolean(item.costPriceComplete),
      productsCount: numeric(item.productsCount ?? item.itemsCount ?? productRecords.reduce((sum, product) => sum + numeric(product.quantity ?? product.count ?? 1), 0)),
      products,
    } satisfies FlowwowOrder;
  });
  const pagination = object(raw.pagination);
  const summaryRaw = object(raw.summary);
  const shopsFromResponse = array(raw.shops ?? object(raw.filters).shops).map((value) => {
    const shop = object(value);
    return {
      id: String(shop.id ?? shop.shopId ?? ""),
      name: String(shop.name ?? shop.shopName ?? shop.id ?? shop.shopId ?? ""),
      address: shop.address ? String(shop.address) : null,
    };
  });
  const shopsFromItems = items.map((item) => ({ id: item.shopId, name: item.shopName, address: item.shopName })).filter((shop) => shop.id);
  const shops = [...new Map([...shopsFromResponse, ...shopsFromItems].map((shop) => [shop.id, shop])).values()];
  const total = numeric(pagination.totalItems ?? pagination.total ?? raw.total ?? summaryRaw.ordersCount ?? items.length);
  const turnover = money(summaryRaw, ["turnover", "revenue", "total"], ["turnoverMinor", "revenueMinor", "totalMinor"]) || items.reduce((sum, item) => sum + item.price, 0);
  const ordersCount = numeric(summaryRaw.ordersCount ?? summaryRaw.count ?? total);
  const commissionExpenses = Math.abs(
    money(
      summaryRaw,
      ["commissionExpenses", "totalCommission", "commission"],
      ["commissionExpensesMinor", "totalCommissionMinor", "commissionMinor"],
    ),
  ) || items.reduce((sum, item) => sum + item.commission, 0);

  return {
    items,
    shops,
    total,
    totalPages: numeric(pagination.totalPages ?? raw.totalPages) || Math.max(1, Math.ceil(total / numeric(pagination.limit ?? 50))),
    summary: {
      ordersCount,
      turnover,
      averageCheck: money(summaryRaw, ["averageCheck"], ["averageCheckMinor"]) || (ordersCount ? turnover / ordersCount : 0),
      commissionExpenses,
    },
  };
}

export const flowwowOrdersStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot() { return state; },
  getServerSnapshot() { return initialState; },
  async load(query: FlowwowOrdersQuery, force = false) {
    const params = new URLSearchParams({
      dateFrom: query.dateFrom,
      dateTo: query.dateTo,
      page: String(query.page),
      limit: String(query.limit),
    });
    if (query.shopId) params.set("shopId", query.shopId);
    const requestKey = params.toString();
    if (!force && state.requestKey === requestKey && (state.isLoading || state.data)) return;

    activeRequest?.abort();
    activeRequest = new AbortController();
    emit({ ...state, isLoading: true, error: null, requestKey });
    try {
      const response = await fetch(`/api/analytics/flowwow/orders?${requestKey}`, { signal: activeRequest.signal, cache: "no-store" });
      if (!response.ok) throw new Error(`API вернул ошибку ${response.status}`);
      emit({ data: normalize(object(await response.json())), isLoading: false, error: null, requestKey });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      emit({ ...state, isLoading: false, error: error instanceof Error ? error.message : "Не удалось загрузить заказы Flowwow", requestKey });
    }
  },
};
