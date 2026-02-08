export type StoredOrderItem = {
  id: string;
  title: string;
  price: number;
  quantity: number;
  cashback: number;
  image: string;
};

export type StoredOrderStatus = 'In Transit' | 'Delivered';
export type ReturnReason = 'Damaged product' | 'Wrong item' | 'Not satisfied';
export type ReturnResolution = 'Refund to Wallet' | 'Replacement';
export type ReturnStatusStep =
  | 'Return Requested'
  | 'Pickup Scheduled'
  | 'Item Picked Up'
  | 'Refund Initiated'
  | 'Replacement Shipped';
export type RefundStatus = 'Initiated' | 'Processing' | 'Completed';

export type ReturnRequest = {
  reason: ReturnReason;
  resolution: ReturnResolution;
  statusStep: ReturnStatusStep;
  refundStatus?: RefundStatus;
};

export type StoredOrder = {
  id: string;
  items: StoredOrderItem[];
  total: number;
  cashbackTotal: number;
  status: StoredOrderStatus;
  createdAt: string;
  expectedDelivery: string;
  address: string;
  seller: string;
  returnRequest?: ReturnRequest;
};

const ordersKey = 'glonni_orders';
const lastOrderKey = 'glonni_last_order_id';
const ordersEvent = 'glonni_orders_update';

let cachedOrders: StoredOrder[] | null = null;
let cachedLastOrderId: string | null = null;

const getStorage = () => (typeof window === 'undefined' ? null : window.localStorage);

const readOrders = (): StoredOrder[] => {
  const storage = getStorage();
  if (!storage) return [];
  try {
    const raw = storage.getItem(ordersKey);
    const parsed = raw ? (JSON.parse(raw) as StoredOrder[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const readLastOrderId = (): string | null => {
  const storage = getStorage();
  if (!storage) return null;
  return storage.getItem(lastOrderKey);
};

export const getStoredOrders = (): StoredOrder[] => {
  return readOrders();
};

export const saveStoredOrders = (orders: StoredOrder[]) => {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(ordersKey, JSON.stringify(orders));
  cachedOrders = orders;
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(ordersEvent));
  }
};

export const addStoredOrder = (order: StoredOrder) => {
  const orders = getStoredOrders();
  const next = [order, ...orders];
  saveStoredOrders(next);
  const storage = getStorage();
  if (storage) {
    storage.setItem(lastOrderKey, order.id);
  }
  cachedLastOrderId = order.id;
  return order;
};

export const updateStoredOrderReturn = (orderId: string, returnRequest: ReturnRequest) => {
  const orders = getStoredOrders();
  const next = orders.map((order) =>
    order.id === orderId ? { ...order, returnRequest } : order
  );
  saveStoredOrders(next);
};

export const getStoredOrderById = (orderId: string) => {
  const orders = getStoredOrders();
  return orders.find((order) => order.id === orderId) || null;
};

export const getLastOrderId = () => {
  return readLastOrderId();
};

export const createOrderId = () => {
  const nextIndex = getStoredOrders().length + 1;
  return `GLN-${String(nextIndex).padStart(5, '0')}`;
};

export const getOrdersSnapshot = () => {
  if (cachedOrders) return cachedOrders;
  cachedOrders = readOrders();
  return cachedOrders;
};

export const getOrdersServerSnapshot = () => [] as StoredOrder[];

export const getLastOrderIdSnapshot = () => {
  if (cachedLastOrderId !== null) return cachedLastOrderId;
  cachedLastOrderId = readLastOrderId();
  return cachedLastOrderId;
};

export const getLastOrderIdServerSnapshot = () => null as string | null;

export const subscribeToOrders = (callback: () => void) => {
  if (typeof window === 'undefined') return () => {};
  const handler = () => {
    cachedOrders = null;
    cachedLastOrderId = null;
    callback();
  };
  window.addEventListener('storage', handler);
  window.addEventListener(ordersEvent, handler);
  return () => {
    window.removeEventListener('storage', handler);
    window.removeEventListener(ordersEvent, handler);
  };
};
