export type AdminSettlementStatus = 'Pending' | 'Processing' | 'Completed';
export type AdminSettlementType = 'Vendor Payout' | 'Affiliate Payout';

export type AdminSettlement = {
  id: string;
  counterparty: string;
  period: string;
  amount: number;
  type: AdminSettlementType;
  status: AdminSettlementStatus;
};

type UpdateAdminSettlement = Partial<Omit<AdminSettlement, 'id'>>;

const settlementsKey = 'glonni_admin_settlements';
const settlementsEvent = 'glonni_admin_settlements_update';

const emptySettlementsSnapshot: AdminSettlement[] = [];

const defaultSettlements: AdminSettlement[] = [
  {
    id: 'set_6001',
    counterparty: 'Aether Studio',
    period: 'Jan 2026',
    amount: 84200,
    type: 'Vendor Payout',
    status: 'Pending',
  },
  {
    id: 'set_6002',
    counterparty: 'Nova Sports',
    period: 'Jan 2026',
    amount: 125400,
    type: 'Vendor Payout',
    status: 'Processing',
  },
  {
    id: 'set_6003',
    counterparty: 'Rhea Kapoor',
    period: 'Jan 2026',
    amount: 18400,
    type: 'Affiliate Payout',
    status: 'Pending',
  },
  {
    id: 'set_6004',
    counterparty: 'Kabir Nair',
    period: 'Dec 2025',
    amount: 26750,
    type: 'Affiliate Payout',
    status: 'Completed',
  },
];

let cachedSettlements: AdminSettlement[] | null = null;

const getStorage = () => (typeof window === 'undefined' ? null : window.localStorage);

const readSettlements = (): AdminSettlement[] => {
  const storage = getStorage();
  if (!storage) return [];
  try {
    const raw = storage.getItem(settlementsKey);
    const parsed = raw ? (JSON.parse(raw) as AdminSettlement[]) : [];
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return defaultSettlements;
  } catch {
    return defaultSettlements;
  }
};

const saveSettlements = (settlements: AdminSettlement[]) => {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(settlementsKey, JSON.stringify(settlements));
  cachedSettlements = settlements;
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(settlementsEvent));
  }
};

export const getAdminSettlementsSnapshot = () => {
  if (cachedSettlements) return cachedSettlements;
  cachedSettlements = readSettlements();
  return cachedSettlements;
};

export const getAdminSettlementsServerSnapshot = () => emptySettlementsSnapshot;

export const subscribeToAdminSettlements = (callback: () => void) => {
  if (typeof window === 'undefined') return () => {};
  const handler = () => {
    cachedSettlements = null;
    callback();
  };
  window.addEventListener('storage', handler);
  window.addEventListener(settlementsEvent, handler);
  return () => {
    window.removeEventListener('storage', handler);
    window.removeEventListener(settlementsEvent, handler);
  };
};

export const updateAdminSettlement = (settlementId: string, updates: UpdateAdminSettlement) => {
  const settlements = getAdminSettlementsSnapshot();
  const nextSettlements = settlements.map((settlement) =>
    settlement.id === settlementId ? { ...settlement, ...updates } : settlement
  );
  saveSettlements(nextSettlements);
};
