export type SellerReturnStatus = 'Requested' | 'Approved' | 'Rejected' | 'Picked' | 'Refunded';

export type SellerReturn = {
  id: string;
  orderId: string;
  productName: string;
  reason: string;
  status: SellerReturnStatus;
  refundAmount: number;
  requestedAt: string;
  rejectionReason?: string;
};

const returnsKey = 'glonni_seller_returns';
const returnsEvent = 'glonni_seller_returns_update';
const emptyReturnsSnapshot: SellerReturn[] = [];

const defaultReturns: SellerReturn[] = [
  {
    id: 'RET-9001',
    orderId: 'ORD-30241',
    productName: 'Aether Linen Shirt',
    reason: 'Size issue',
    status: 'Requested',
    refundAmount: 3480,
    requestedAt: '06 Feb 2026',
  },
  {
    id: 'RET-9002',
    orderId: 'ORD-30238',
    productName: 'Nimbus Desk Lamp',
    reason: 'Damaged product',
    status: 'Approved',
    refundAmount: 2199,
    requestedAt: '05 Feb 2026',
  },
  {
    id: 'RET-9003',
    orderId: 'ORD-30237',
    productName: 'Luna Travel Tote',
    reason: 'Wrong item',
    status: 'Refunded',
    refundAmount: 3600,
    requestedAt: '03 Feb 2026',
  },
  {
    id: 'RET-9004',
    orderId: 'ORD-30236',
    productName: 'Aura Ceramic Mug',
    reason: 'Not satisfied',
    status: 'Rejected',
    refundAmount: 2340,
    requestedAt: '02 Feb 2026',
    rejectionReason: 'Used product not eligible for return',
  },
];

let cachedReturns: SellerReturn[] | null = null;

const getStorage = () => (typeof window === 'undefined' ? null : window.localStorage);

const readReturns = (): SellerReturn[] => {
  const storage = getStorage();
  if (!storage) return [];
  try {
    const raw = storage.getItem(returnsKey);
    const parsed = raw ? (JSON.parse(raw) as SellerReturn[]) : [];
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return defaultReturns;
  } catch {
    return defaultReturns;
  }
};

const saveReturns = (returnsData: SellerReturn[]) => {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(returnsKey, JSON.stringify(returnsData));
  cachedReturns = returnsData;
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(returnsEvent));
  }
};

export const getSellerReturnsSnapshot = () => {
  if (cachedReturns) return cachedReturns;
  cachedReturns = readReturns();
  return cachedReturns;
};

export const getSellerReturnsServerSnapshot = () => emptyReturnsSnapshot;

export const subscribeToSellerReturns = (callback: () => void) => {
  if (typeof window === 'undefined') return () => {};
  const handler = () => {
    cachedReturns = null;
    callback();
  };
  window.addEventListener('storage', handler);
  window.addEventListener(returnsEvent, handler);
  return () => {
    window.removeEventListener('storage', handler);
    window.removeEventListener(returnsEvent, handler);
  };
};

export const updateSellerReturnStatus = (
  returnId: string,
  status: SellerReturnStatus,
  rejectionReason?: string
) => {
  const returnsData = getSellerReturnsSnapshot();
  const next = returnsData.map((entry) =>
    entry.id === returnId
      ? {
          ...entry,
          status,
          rejectionReason: status === 'Rejected' ? rejectionReason : entry.rejectionReason,
        }
      : entry
  );
  saveReturns(next);
};

export const getSellerReturnById = (returnId: string) => {
  const returnsData = getSellerReturnsSnapshot();
  return returnsData.find((entry) => entry.id === returnId) || null;
};
