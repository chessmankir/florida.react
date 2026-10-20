export type ExpensesQuery = {
  dateFrom: string;
  dateTo: string;
  paymentType: "all" | "paymentout" | "cashout" | "loss";
  page: number;
  limit: number;
};

export type ExpenseSummary = {
  paymentsCount: number;
  total: number;
  paymentOut: number;
  cashOut: number;
  loss: number;
};

export type ExpenseCategory = {
  expenseItemId: string;
  expenseItemName: string;
  paymentsCount: number;
  total: number;
  sharePercent: number;
};

export type ExpenseItem = {
  id: string;
  paymentType: string;
  name: string;
  description: string | null;
  moment: string;
  isPosted: boolean;
  sum: number;
  vatSum: number;
  expenseItemName: string | null;
  positions: ExpenseLossPosition[];
};

export type ExpenseLossPosition = {
  id: string;
  assortmentId: string | null;
  name: string;
  quantity: number;
  price: number;
  total: number;
};

export type ExpensesResponse = {
  period: { dateFrom: string; dateTo: string };
  summary: ExpenseSummary;
  categories: ExpenseCategory[];
  items: ExpenseItem[];
  pagination: { page: number; limit: number; totalItems: number; totalPages: number };
};

type ApiExpensesResponse = {
  period: ExpensesResponse["period"];
  summary: {
    paymentsCount: number;
    totalMinor: string;
    paymentOutMinor: string;
    cashOutMinor: string;
    lossMinor: string;
  };
  categories: Array<{
    expenseItemId: string;
    expenseItemName: string;
    paymentsCount: number;
    totalMinor: string;
    sharePercent: string;
  }>;
  items: Array<{
    id: string;
    paymentType: string;
    name: string;
    description: string | null;
    moment: string;
    isPosted: boolean;
    sumMinor: string;
    vatSumMinor: string;
    expenseItemName: string | null;
    positions?: Array<{
      id: string;
      assortmentId: string | null;
      name: string;
      quantity: string;
      priceMinor: string;
      totalMinor: string;
    }>;
  }>;
  pagination: ExpensesResponse["pagination"];
};

type ExpensesState = {
  data: ExpensesResponse | null;
  isLoading: boolean;
  error: string | null;
  requestKey: string | null;
};

export const defaultExpensesQuery: ExpensesQuery = {
  dateFrom: "2026-09-01",
  dateTo: "2026-09-30",
  paymentType: "all",
  page: 1,
  limit: 10,
};

const initialState: ExpensesState = { data: null, isLoading: true, error: null, requestKey: null };
let state = initialState;
let activeRequest: AbortController | null = null;
const listeners = new Set<() => void>();

function emit(nextState: ExpensesState) {
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

function normalize(data: ApiExpensesResponse): ExpensesResponse {
  return {
    period: data.period,
    pagination: data.pagination,
    summary: {
      paymentsCount: data.summary.paymentsCount,
      total: money(data.summary.totalMinor),
      paymentOut: money(data.summary.paymentOutMinor),
      cashOut: money(data.summary.cashOutMinor),
      loss: money(data.summary.lossMinor),
    },
    categories: data.categories.map((category) => ({
      expenseItemId: category.expenseItemId,
      expenseItemName: category.expenseItemName,
      paymentsCount: category.paymentsCount,
      total: money(category.totalMinor),
      sharePercent: number(category.sharePercent),
    })),
    items: data.items.map((item) => ({
      id: item.id,
      paymentType: item.paymentType,
      name: item.name,
      description: item.description,
      moment: item.moment,
      isPosted: item.isPosted,
      sum: money(item.sumMinor),
      vatSum: money(item.vatSumMinor),
      expenseItemName: item.expenseItemName,
      positions: (item.positions ?? []).map((position) => ({
        id: position.id,
        assortmentId: position.assortmentId,
        name: position.name,
        quantity: number(position.quantity),
        price: money(position.priceMinor),
        total: money(position.totalMinor),
      })),
    })),
  };
}

export const expensesStore = {
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
  async load(query: ExpensesQuery) {
    const params = new URLSearchParams({
      dateFrom: query.dateFrom,
      dateTo: query.dateTo,
      paymentType: query.paymentType,
      page: String(query.page),
      limit: String(query.limit),
    });
    const requestKey = params.toString();
    if (state.requestKey === requestKey && (state.isLoading || state.data)) return;

    activeRequest?.abort();
    activeRequest = new AbortController();
    emit({ ...state, isLoading: true, error: null, requestKey });

    try {
      const response = await fetch(`/api/analytics/expenses?${requestKey}`, {
        signal: activeRequest.signal,
        cache: "no-store",
      });
      if (!response.ok) throw new Error(`API вернул ошибку ${response.status}`);
      const data = normalize((await response.json()) as ApiExpensesResponse);
      emit({ data, isLoading: false, error: null, requestKey });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      emit({
        ...state,
        isLoading: false,
        error: error instanceof Error ? error.message : "Не удалось загрузить расходы",
        requestKey,
      });
    }
  },
};
