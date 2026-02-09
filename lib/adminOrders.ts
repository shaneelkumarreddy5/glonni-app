export type AdminOrderPaymentStatus = 'Paid' | 'Failed' | 'Pending' | 'Refunded';
export type AdminOrderStatus =
  | 'Placed'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';
export type AdminReturnStatus = 'None' | 'Pending' | 'Approved' | 'Rejected';

export type AdminOrderItem = {
  id: string;
  name: string;
  qty: number;
  price: number;
};

export type AdminOrder = {
  id: string;
  date: string;
  userName: string;
  userEmail: string;
  vendorName: string;
  vendorId: string;
  value: number;
  paymentStatus: AdminOrderPaymentStatus;
  orderStatus: AdminOrderStatus;
  returnStatus: AdminReturnStatus;
  items: AdminOrderItem[];
  paymentMethod: string;
  transactionId: string;
  cashback: number;
  commission: number;
  internalNote?: string;
};

type UpdateAdminOrder = Partial<Omit<AdminOrder, 'id'>>;

const ordersKey = 'glonni_admin_orders';
const ordersEvent = 'glonni_admin_orders_update';

const emptyOrdersSnapshot: AdminOrder[] = [];

const defaultOrders: AdminOrder[] = [
  {
    id: 'ord_7001',
    date: '08 Feb 2026',
    userName: 'Rhea Kapoor',
    userEmail: 'rhea.kapoor@glonni.app',
    vendorName: 'Aether Studio',
    vendorId: 'vnd_2001',
    value: 2499,
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    returnStatus: 'None',
    items: [{ id: 'prd_1001', name: 'Aether Linen Shirt', qty: 1, price: 2499 }],
    paymentMethod: 'UPI',
    transactionId: 'TXN-9011',
    cashback: 120,
    commission: 175,
  },
  {
    id: 'ord_7002',
    date: '08 Feb 2026',
    userName: 'Devansh Rao',
    userEmail: 'devansh.rao@glonni.app',
    vendorName: 'Nimbus Home',
    vendorId: 'vnd_2002',
    value: 2199,
    paymentStatus: 'Failed',
    orderStatus: 'Placed',
    returnStatus: 'None',
    items: [{ id: 'prd_1004', name: 'Nimbus Desk Lamp', qty: 1, price: 2199 }],
    paymentMethod: 'Card',
    transactionId: 'TXN-9012',
    cashback: 90,
    commission: 140,
  },
  {
    id: 'ord_7003',
    date: '07 Feb 2026',
    userName: 'Arjun Varma',
    userEmail: 'arjun.varma@glonni.app',
    vendorName: 'Nova Sports',
    vendorId: 'vnd_2005',
    value: 5999,
    paymentStatus: 'Paid',
    orderStatus: 'Shipped',
    returnStatus: 'Pending',
    items: [{ id: 'prd_1002', name: 'Nova Running Shoes', qty: 1, price: 5999 }],
    paymentMethod: 'UPI',
    transactionId: 'TXN-9013',
    cashback: 240,
    commission: 320,
  },
  {
    id: 'ord_7004',
    date: '05 Feb 2026',
    userName: 'Ariana Mehta',
    userEmail: 'ariana.mehta@glonni.app',
    vendorName: 'Flux Accessories',
    vendorId: 'vnd_2004',
    value: 1250,
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    returnStatus: 'Approved',
    items: [{ id: 'prd_1003', name: 'Flux Leather Wallet', qty: 1, price: 1250 }],
    paymentMethod: 'Wallet',
    transactionId: 'TXN-9014',
    cashback: 60,
    commission: 95,
  },
  {
    id: 'ord_7005',
    date: '03 Feb 2026',
    userName: 'Isha Banerjee',
    userEmail: 'isha.banerjee@glonni.app',
    vendorName: 'Nova Sports',
    vendorId: 'vnd_2005',
    value: 18999,
    paymentStatus: 'Paid',
    orderStatus: 'Processing',
    returnStatus: 'None',
    items: [
      { id: 'prd_1002', name: 'Nova Running Shoes', qty: 1, price: 5999 },
      { id: 'prd_1006', name: 'Aura Ceramic Mug', qty: 2, price: 780 },
    ],
    paymentMethod: 'Card',
    transactionId: 'TXN-9015',
    cashback: 520,
    commission: 780,
  },
];

let cachedOrders: AdminOrder[] | null = null;

const getStorage = () => (typeof window === 'undefined' ? null : window.localStorage);

const readOrders = (): AdminOrder[] => {
  const storage = getStorage();
  if (!storage) return [];
  try {
    const raw = storage.getItem(ordersKey);
    const parsed = raw ? (JSON.parse(raw) as AdminOrder[]) : [];
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return defaultOrders;
  } catch {
    return defaultOrders;
  }
};

const saveOrders = (orders: AdminOrder[]) => {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(ordersKey, JSON.stringify(orders));
  cachedOrders = orders;
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(ordersEvent));
  }
};

export const getAdminOrdersSnapshot = () => {
  if (cachedOrders) return cachedOrders;
  cachedOrders = readOrders();
  return cachedOrders;
};

export const getAdminOrdersServerSnapshot = () => emptyOrdersSnapshot;

export const subscribeToAdminOrders = (callback: () => void) => {
  if (typeof window === 'undefined') return () => {};
  const handler = () => {
    cachedOrders = null;
    callback();
  };
  window.addEventListener('storage', handler);
  window.addEventListener(ordersEvent, handler);
  return () => {
    window.removeEventListener('storage', handler);
    window.removeEventListener(ordersEvent, handler);
  };
};

export const updateAdminOrder = (orderId: string, updates: UpdateAdminOrder) => {
  const orders = getAdminOrdersSnapshot();
  const nextOrders = orders.map((order) =>
    order.id === orderId ? { ...order, ...updates } : order
  );
  saveOrders(nextOrders);
};

export const findAdminOrder = (orderId: string) => {
  const orders = getAdminOrdersSnapshot();
  return orders.find((order) => order.id === orderId) || null;
};
