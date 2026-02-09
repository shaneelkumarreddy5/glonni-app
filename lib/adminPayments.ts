export type AdminPaymentStatus = 'Pending' | 'Success' | 'Failed' | 'Refunded';
export type AdminPaymentMethod = 'UPI' | 'Card' | 'COD';

export type AdminPayment = {
  id: string;
  orderId: string;
  userName: string;
  vendorName: string;
  amount: number;
  method: AdminPaymentMethod;
  status: AdminPaymentStatus;
  date: string;
};

type UpdateAdminPayment = Partial<Omit<AdminPayment, 'id'>>;

const paymentsKey = 'glonni_admin_payments';
const paymentsEvent = 'glonni_admin_payments_update';

const emptyPaymentsSnapshot: AdminPayment[] = [];

const defaultPayments: AdminPayment[] = [
  {
    id: 'pay_5001',
    orderId: 'ord_7001',
    userName: 'Rhea Kapoor',
    vendorName: 'Aether Studio',
    amount: 2499,
    method: 'UPI',
    status: 'Success',
    date: '08 Feb 2026',
  },
  {
    id: 'pay_5002',
    orderId: 'ord_7002',
    userName: 'Devansh Rao',
    vendorName: 'Nimbus Home',
    amount: 2199,
    method: 'Card',
    status: 'Failed',
    date: '08 Feb 2026',
  },
  {
    id: 'pay_5003',
    orderId: 'ord_7003',
    userName: 'Arjun Varma',
    vendorName: 'Nova Sports',
    amount: 5999,
    method: 'UPI',
    status: 'Pending',
    date: '07 Feb 2026',
  },
  {
    id: 'pay_5004',
    orderId: 'ord_7004',
    userName: 'Ariana Mehta',
    vendorName: 'Flux Accessories',
    amount: 1250,
    method: 'COD',
    status: 'Refunded',
    date: '05 Feb 2026',
  },
  {
    id: 'pay_5005',
    orderId: 'ord_7005',
    userName: 'Isha Banerjee',
    vendorName: 'Nova Sports',
    amount: 18999,
    method: 'Card',
    status: 'Success',
    date: '03 Feb 2026',
  },
];

let cachedPayments: AdminPayment[] | null = null;

const getStorage = () => (typeof window === 'undefined' ? null : window.localStorage);

const readPayments = (): AdminPayment[] => {
  const storage = getStorage();
  if (!storage) return [];
  try {
    const raw = storage.getItem(paymentsKey);
    const parsed = raw ? (JSON.parse(raw) as AdminPayment[]) : [];
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return defaultPayments;
  } catch {
    return defaultPayments;
  }
};

const savePayments = (payments: AdminPayment[]) => {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(paymentsKey, JSON.stringify(payments));
  cachedPayments = payments;
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(paymentsEvent));
  }
};

export const getAdminPaymentsSnapshot = () => {
  if (cachedPayments) return cachedPayments;
  cachedPayments = readPayments();
  return cachedPayments;
};

export const getAdminPaymentsServerSnapshot = () => emptyPaymentsSnapshot;

export const subscribeToAdminPayments = (callback: () => void) => {
  if (typeof window === 'undefined') return () => {};
  const handler = () => {
    cachedPayments = null;
    callback();
  };
  window.addEventListener('storage', handler);
  window.addEventListener(paymentsEvent, handler);
  return () => {
    window.removeEventListener('storage', handler);
    window.removeEventListener(paymentsEvent, handler);
  };
};

export const updateAdminPayment = (paymentId: string, updates: UpdateAdminPayment) => {
  const payments = getAdminPaymentsSnapshot();
  const nextPayments = payments.map((payment) =>
    payment.id === paymentId ? { ...payment, ...updates } : payment
  );
  savePayments(nextPayments);
};
