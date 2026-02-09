export type AdminReturnStatus =
  | 'Pending Review'
  | 'Approved'
  | 'Rejected'
  | 'Forced Refund';

export type AdminReturn = {
  id: string;
  orderId: string;
  userName: string;
  vendorName: string;
  reason: string;
  refundAmount: number;
  status: AdminReturnStatus;
  timeline: { label: string; date: string }[];
  refundMethod: string;
  walletImpact: string;
  vendorDecision: string;
};

type UpdateAdminReturn = Partial<Omit<AdminReturn, 'id'>>;

const returnsKey = 'glonni_admin_returns';
const returnsEvent = 'glonni_admin_returns_update';

const emptyReturnsSnapshot: AdminReturn[] = [];

const defaultReturns: AdminReturn[] = [
  {
    id: 'ret_9001',
    orderId: 'ord_7003',
    userName: 'Arjun Varma',
    vendorName: 'Nova Sports',
    reason: 'Size mismatch',
    refundAmount: 5999,
    status: 'Pending Review',
    timeline: [
      { label: 'Return requested', date: '08 Feb 2026' },
      { label: 'Pickup scheduled', date: '09 Feb 2026' },
    ],
    refundMethod: 'Original Payment Method',
    walletImpact: 'Cashback reversal ₹240',
    vendorDecision: 'Pending vendor approval',
  },
  {
    id: 'ret_9002',
    orderId: 'ord_7004',
    userName: 'Ariana Mehta',
    vendorName: 'Flux Accessories',
    reason: 'Damaged on arrival',
    refundAmount: 1250,
    status: 'Approved',
    timeline: [
      { label: 'Return requested', date: '06 Feb 2026' },
      { label: 'Pickup completed', date: '07 Feb 2026' },
      { label: 'Approved by vendor', date: '07 Feb 2026' },
    ],
    refundMethod: 'Wallet',
    walletImpact: 'Refund posted to wallet',
    vendorDecision: 'Approved by vendor',
  },
  {
    id: 'ret_9003',
    orderId: 'ord_7001',
    userName: 'Rhea Kapoor',
    vendorName: 'Aether Studio',
    reason: 'Late delivery',
    refundAmount: 2499,
    status: 'Rejected',
    timeline: [
      { label: 'Return requested', date: '04 Feb 2026' },
      { label: 'Vendor rejected', date: '05 Feb 2026' },
    ],
    refundMethod: 'Original Payment Method',
    walletImpact: 'No refund issued',
    vendorDecision: 'Rejected by vendor',
  },
];

let cachedReturns: AdminReturn[] | null = null;

const getStorage = () => (typeof window === 'undefined' ? null : window.localStorage);

const readReturns = (): AdminReturn[] => {
  const storage = getStorage();
  if (!storage) return [];
  try {
    const raw = storage.getItem(returnsKey);
    const parsed = raw ? (JSON.parse(raw) as AdminReturn[]) : [];
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return defaultReturns;
  } catch {
    return defaultReturns;
  }
};

const saveReturns = (returnsList: AdminReturn[]) => {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(returnsKey, JSON.stringify(returnsList));
  cachedReturns = returnsList;
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(returnsEvent));
  }
};

export const getAdminReturnsSnapshot = () => {
  if (cachedReturns) return cachedReturns;
  cachedReturns = readReturns();
  return cachedReturns;
};

export const getAdminReturnsServerSnapshot = () => emptyReturnsSnapshot;

export const subscribeToAdminReturns = (callback: () => void) => {
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

export const updateAdminReturn = (returnId: string, updates: UpdateAdminReturn) => {
  const returnsList = getAdminReturnsSnapshot();
  const nextReturns = returnsList.map((item) =>
    item.id === returnId ? { ...item, ...updates } : item
  );
  saveReturns(nextReturns);
};

export const findAdminReturn = (returnId: string) => {
  const returnsList = getAdminReturnsSnapshot();
  return returnsList.find((item) => item.id === returnId) || null;
};
