export type SortDirection = "asc" | "desc";
export type ProductSortKey = "name" | "revenue" | "cost" | "grossProfit" | "marginPercent" | "soldQuantity";

export type ProductsQuery = {
  dateFrom: string;
  dateTo: string;
  sortBy: ProductSortKey;
  sortDirection: SortDirection;
  page: number;
  limit: number;
};

export type ProductProfitability = {
  productId: string;
  productType: string;
  name: string;
  code: string;
  article: string | null;
  soldQuantity: number;
  returnQuantity: number;
  netSoldQuantity: number;
  revenue: number;
  cost: number;
  grossProfit: number;
  marginPercent: number;
  returnRatePercent: number;
};

export type ProductsSummary = {
  productsCount: number;
  soldQuantity: number;
  returnQuantity: number;
  netSoldQuantity: number;
  revenue: number;
  cost: number;
  grossProfit: number;
  marginPercent: number;
  returnRatePercent: number;
};

export type ProductsResponse = {
  period: { dateFrom: string; dateTo: string };
  summary: ProductsSummary;
  items: ProductProfitability[];
  pagination: { page: number; limit: number; totalItems: number; totalPages: number };
};

type ApiProduct = Omit<ProductProfitability, "soldQuantity" | "returnQuantity" | "netSoldQuantity" | "revenue" | "cost" | "grossProfit" | "marginPercent" | "returnRatePercent"> & {
  revenueMinor: string;
  costMinor: string;
  grossProfitMinor: string;
  soldQuantity: string;
  returnQuantity: string;
  netSoldQuantity: string;
  marginPercent: string;
  returnRatePercent: string;
};

type ApiResponse = {
  period: ProductsResponse["period"];
  summary: {
    productsCount: number;
    soldQuantity: string;
    returnQuantity: string;
    netSoldQuantity: string;
    revenueMinor: string;
    costMinor: string;
    grossProfitMinor: string;
    marginPercent: string;
    returnRatePercent: string;
  };
  items: ApiProduct[];
  pagination: ProductsResponse["pagination"];
};

type ProductsState = {
  data: ProductsResponse | null;
  isLoading: boolean;
  error: string | null;
  requestKey: string | null;
};

export const defaultProductsQuery: ProductsQuery = {
  dateFrom: "2026-09-01",
  dateTo: "2026-09-30",
  sortBy: "grossProfit",
  sortDirection: "desc",
  page: 1,
  limit: 50,
};

const initialState: ProductsState = { data: null, isLoading: true, error: null, requestKey: null };
let state = initialState;
let activeRequest: AbortController | null = null;
const listeners = new Set<() => void>();

function emit(nextState: ProductsState) {
  state = nextState;
  listeners.forEach((listener) => listener());
}
function number(value: string | number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function money(value: string) {
  return number(value) / 100;
}

function normalize(data: ApiResponse): ProductsResponse {
  return {
    period: data.period,
    pagination: data.pagination,
    summary: {
      productsCount: data.summary.productsCount,
      soldQuantity: number(data.summary.soldQuantity),
      returnQuantity: number(data.summary.returnQuantity),
      netSoldQuantity: number(data.summary.netSoldQuantity),
      revenue: money(data.summary.revenueMinor),
      cost: money(data.summary.costMinor),
      grossProfit: money(data.summary.grossProfitMinor),
      marginPercent: number(data.summary.marginPercent),
      returnRatePercent: number(data.summary.returnRatePercent),
    },
    items: data.items.map((item) => ({
      productId: item.productId,
      productType: item.productType,
      name: item.name,
      code: item.code,
      article: item.article,
      soldQuantity: number(item.soldQuantity),
      returnQuantity: number(item.returnQuantity),
      netSoldQuantity: number(item.netSoldQuantity),
      revenue: money(item.revenueMinor),
      cost: money(item.costMinor),
      grossProfit: money(item.grossProfitMinor),
      marginPercent: number(item.marginPercent),
      returnRatePercent: number(item.returnRatePercent),
    })),
  };
}

export const productsStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot() {
    return state;
  },
  getServerSnapshot() {
    return initialState;
  },
  async load(query: ProductsQuery) {
    const params = new URLSearchParams({
      dateFrom: query.dateFrom,
      dateTo: query.dateTo,
      sortBy: query.sortBy,
      sortDirection: query.sortDirection,
      page: String(query.page),
      limit: String(query.limit),
    });
    const requestKey = params.toString();
    if (state.requestKey === requestKey && (state.isLoading || state.data)) return;

    activeRequest?.abort();
    activeRequest = new AbortController();
    emit({ ...state, isLoading: true, error: null, requestKey });

    try {
      const response = await fetch(`/api/analytics/products/profitability?${requestKey}`, {
        signal: activeRequest.signal,
        cache: "no-store",
      });
      if (!response.ok) throw new Error(`API вернул ошибку ${response.status}`);
      const data = normalize((await response.json()) as ApiResponse);
      emit({ data, isLoading: false, error: null, requestKey });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      emit({
        ...state,
        isLoading: false,
        error: error instanceof Error ? error.message : "Не удалось загрузить данные",
        requestKey,
      });
    }
  },
};
