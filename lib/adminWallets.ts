export type AdminWalletType = 'User' | 'Vendor' | 'Affiliate';
export type AdminWalletTxnStatus = 'Completed' | 'Pending' | 'Reversed';

export type AdminWalletBalance = {
  type: AdminWalletType;
  label: string;
  balance: number;
};

export type AdminWalletTxn = {
  id: string;
  walletType: AdminWalletType;
  reference: string;
  direction: 'Credit' | 'Debit';
  amount: number;
  status: AdminWalletTxnStatus;
  date: string;
};

const walletsKey = 'glonni_admin_wallets';
const walletsEvent = 'glonni_admin_wallets_update';

const emptyWalletSnapshot: { balances: AdminWalletBalance[]; txns: AdminWalletTxn[] } = {
  balances: [],
  txns: [],
};

const defaultWallets: { balances: AdminWalletBalance[]; txns: AdminWalletTxn[] } = {
  balances: [
    { type: 'User', label: 'User Wallets', balance: 482000 },
    { type: 'Vendor', label: 'Vendor Payables', balance: 1265000 },
    { type: 'Affiliate', label: 'Affiliate Payables', balance: 214000 },
  ],
  txns: [
    {
      id: 'wal_3001',
      walletType: 'User',
      reference: 'Order ord_7001',
      direction: 'Credit',
      amount: 120,
      status: 'Completed',
      date: '08 Feb 2026',
    },
    {
      id: 'wal_3002',
      walletType: 'Vendor',
      reference: 'Order ord_7005',
      direction: 'Credit',
      amount: 780,
      status: 'Pending',
      date: '07 Feb 2026',
    },
    {
      id: 'wal_3003',
      walletType: 'Affiliate',
      reference: 'Commission ord_7003',
      direction: 'Credit',
      amount: 320,
      status: 'Completed',
      date: '07 Feb 2026',
    },
    {
      id: 'wal_3004',
      walletType: 'User',
      reference: 'Return ret_9002',
      direction: 'Credit',
      amount: 1250,
      status: 'Completed',
      date: '06 Feb 2026',
    },
    {
      id: 'wal_3005',
      walletType: 'Vendor',
      reference: 'Settlement Jan 2026',
      direction: 'Debit',
      amount: 42000,
      status: 'Completed',
      date: '04 Feb 2026',
    },
    {
      id: 'wal_3006',
      walletType: 'Affiliate',
      reference: 'Payout Feb 2026',
      direction: 'Debit',
      amount: 18000,
      status: 'Completed',
      date: '03 Feb 2026',
    },
  ],
};

let cachedWallets: { balances: AdminWalletBalance[]; txns: AdminWalletTxn[] } | null = null;

const getStorage = () => (typeof window === 'undefined' ? null : window.localStorage);

const readWallets = () => {
  const storage = getStorage();
  if (!storage) return emptyWalletSnapshot;
  try {
    const raw = storage.getItem(walletsKey);
    const parsed = raw
      ? (JSON.parse(raw) as { balances: AdminWalletBalance[]; txns: AdminWalletTxn[] })
      : null;
    if (parsed && parsed.balances.length > 0) {
      return parsed;
    }
    return defaultWallets;
  } catch {
    return defaultWallets;
  }
};

const saveWallets = (wallets: { balances: AdminWalletBalance[]; txns: AdminWalletTxn[] }) => {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(walletsKey, JSON.stringify(wallets));
  cachedWallets = wallets;
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(walletsEvent));
  }
};

export const getAdminWalletsSnapshot = () => {
  if (cachedWallets) return cachedWallets;
  cachedWallets = readWallets();
  return cachedWallets;
};

export const getAdminWalletsServerSnapshot = () => emptyWalletSnapshot;

export const subscribeToAdminWallets = (callback: () => void) => {
  if (typeof window === 'undefined') return () => {};
  const handler = () => {
    cachedWallets = null;
    callback();
  };
  window.addEventListener('storage', handler);
  window.addEventListener(walletsEvent, handler);
  return () => {
    window.removeEventListener('storage', handler);
    window.removeEventListener(walletsEvent, handler);
  };
};

export const updateAdminWallets = (wallets: { balances: AdminWalletBalance[]; txns: AdminWalletTxn[] }) => {
  saveWallets(wallets);
};
