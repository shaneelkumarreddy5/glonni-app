export type SellerOrderStatus = 'New' | 'Packed' | 'Shipped' | 'Delivered' | 'Returned';
export type SellerPaymentStatus = 'Paid' | 'COD';

export type SellerOrderItem = {
  id: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
};

export type SellerOrder = {
  id: string;
  date: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: SellerOrderItem[];
  amount: number;
  paymentStatus: SellerPaymentStatus;
  status: SellerOrderStatus;
  hasReturn: boolean;
};

const ordersKey = 'glonni_seller_orders';
const ordersEvent = 'glonni_seller_orders_update';
const emptyOrdersSnapshot: SellerOrder[] = [];

const defaultOrders: SellerOrder[] = [
  {
    id: 'ORD-30241',
    date: '06 Feb 2026',
    customerName: 'Arjun Mehta',
    customerPhone: '+91 98765 11223',
    customerAddress: '221B Baker Street, London',
    items: [
      {
        id: 'itm-01',
        name: 'Aether Linen Shirt',
        image:
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=200&q=80',
        quantity: 2,
        price: 1740,
      },
    ],
    amount: 3480,
    paymentStatus: 'Paid',
    status: 'New',
    hasReturn: false,
  },
  {
    id: 'ORD-30240',
    date: '05 Feb 2026',
    customerName: 'Neha Rao',
    customerPhone: '+91 98220 55810',
    customerAddress: '17 Palm Grove, Mumbai',
    items: [
      {
        id: 'itm-02',
        name: 'Nova Running Shoes',
        image:
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=200&q=80',
        quantity: 1,
        price: 5999,
      },
    ],
    amount: 5999,
    paymentStatus: 'Paid',
    status: 'Packed',
    hasReturn: false,
  },
  {
    id: 'ORD-30239',
    date: '04 Feb 2026',
    customerName: 'Rahul Das',
    customerPhone: '+91 99110 55112',
    customerAddress: '8 Lakeside Road, Bengaluru',
    items: [
      {
        id: 'itm-03',
        name: 'Flux Leather Wallet',
        image:
          'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=200&q=80',
        quantity: 1,
        price: 1250,
      },
    ],
    amount: 1250,
    paymentStatus: 'COD',
    status: 'Shipped',
    hasReturn: false,
  },
  {
    id: 'ORD-30238',
    date: '02 Feb 2026',
    customerName: 'Sara Khan',
    customerPhone: '+91 98990 44210',
    customerAddress: '12 Orchid Lane, Hyderabad',
    items: [
      {
        id: 'itm-04',
        name: 'Nimbus Desk Lamp',
        image:
          'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=200&q=80',
        quantity: 1,
        price: 2199,
      },
    ],
    amount: 2199,
    paymentStatus: 'Paid',
    status: 'Delivered',
    hasReturn: true,
  },
  {
    id: 'ORD-30237',
    date: '01 Feb 2026',
    customerName: 'Deepa Iyer',
    customerPhone: '+91 98100 88711',
    customerAddress: '44 Sunrise Avenue, Pune',
    items: [
      {
        id: 'itm-05',
        name: 'Luna Travel Tote',
        image:
          'https://images.unsplash.com/photo-1522770179533-24471fcdba45?auto=format&fit=crop&w=200&q=80',
        quantity: 1,
        price: 3600,
      },
    ],
    amount: 3600,
    paymentStatus: 'Paid',
    status: 'Returned',
    hasReturn: true,
  },
  {
    id: 'ORD-30236',
    date: '30 Jan 2026',
    customerName: 'Vikram Nair',
    customerPhone: '+91 97555 66330',
    customerAddress: '55 Maple Street, Chennai',
    items: [
      {
        id: 'itm-06',
        name: 'Aura Ceramic Mug',
        image:
          'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=200&q=80',
        quantity: 3,
        price: 780,
      },
    ],
    amount: 2340,
    paymentStatus: 'COD',
    status: 'Delivered',
    hasReturn: false,
  },
];

let cachedOrders: SellerOrder[] | null = null;

const getStorage = () => (typeof window === 'undefined' ? null : window.localStorage);

const readOrders = (): SellerOrder[] => {
  const storage = getStorage();
  if (!storage) return [];
  try {
    const raw = storage.getItem(ordersKey);
    const parsed = raw ? (JSON.parse(raw) as SellerOrder[]) : [];
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return defaultOrders;
  } catch {
    return defaultOrders;
  }
};

const saveOrders = (orders: SellerOrder[]) => {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(ordersKey, JSON.stringify(orders));
  cachedOrders = orders;
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(ordersEvent));
  }
};

export const getSellerOrdersSnapshot = () => {
  if (cachedOrders) return cachedOrders;
  cachedOrders = readOrders();
  return cachedOrders;
};

export const getSellerOrdersServerSnapshot = () => emptyOrdersSnapshot;

export const subscribeToSellerOrders = (callback: () => void) => {
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

export const updateSellerOrderStatus = (orderId: string, status: SellerOrderStatus) => {
  const orders = getSellerOrdersSnapshot();
  const next = orders.map((order) => (order.id === orderId ? { ...order, status } : order));
  saveOrders(next);
};

export const getSellerOrderById = (orderId: string) => {
  const orders = getSellerOrdersSnapshot();
  return orders.find((order) => order.id === orderId) || null;
};
