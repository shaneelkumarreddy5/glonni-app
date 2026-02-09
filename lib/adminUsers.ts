export type AdminUserRole = 'user' | 'seller' | 'affiliate' | 'admin';
export type AdminUserStatus = 'Active' | 'Suspended';

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: AdminUserRole;
  status: AdminUserStatus;
  joinedAt: string;
  ordersCount: number;
  returnsCount: number;
};

type UpdateAdminUser = Partial<Omit<AdminUser, 'id'>>;

const usersKey = 'glonni_admin_users';
const usersEvent = 'glonni_admin_users_update';

const emptyUsersSnapshot: AdminUser[] = [];

const defaultUsers: AdminUser[] = [
  {
    id: 'usr_1001',
    name: 'Ariana Mehta',
    email: 'ariana.mehta@glonni.app',
    phone: '+91 90000 11001',
    role: 'admin',
    status: 'Active',
    joinedAt: '12 Jan 2024',
    ordersCount: 0,
    returnsCount: 0,
  },
  {
    id: 'usr_1002',
    name: 'Kabir Nair',
    email: 'kabir.nair@glonni.app',
    phone: '+91 90000 11002',
    role: 'seller',
    status: 'Active',
    joinedAt: '08 Jun 2025',
    ordersCount: 312,
    returnsCount: 8,
  },
  {
    id: 'usr_1003',
    name: 'Rhea Kapoor',
    email: 'rhea.kapoor@glonni.app',
    phone: '+91 90000 11003',
    role: 'affiliate',
    status: 'Active',
    joinedAt: '19 Nov 2025',
    ordersCount: 58,
    returnsCount: 2,
  },
  {
    id: 'usr_1004',
    name: 'Devansh Rao',
    email: 'devansh.rao@glonni.app',
    phone: '+91 90000 11004',
    role: 'user',
    status: 'Active',
    joinedAt: '02 Feb 2025',
    ordersCount: 14,
    returnsCount: 1,
  },
  {
    id: 'usr_1005',
    name: 'Isha Banerjee',
    email: 'isha.banerjee@glonni.app',
    phone: '+91 90000 11005',
    role: 'seller',
    status: 'Suspended',
    joinedAt: '27 Aug 2024',
    ordersCount: 96,
    returnsCount: 9,
  },
  {
    id: 'usr_1006',
    name: 'Arjun Varma',
    email: 'arjun.varma@glonni.app',
    phone: '+91 90000 11006',
    role: 'user',
    status: 'Active',
    joinedAt: '05 Oct 2023',
    ordersCount: 120,
    returnsCount: 6,
  },
];

let cachedUsers: AdminUser[] | null = null;

const getStorage = () => (typeof window === 'undefined' ? null : window.localStorage);

const readUsers = (): AdminUser[] => {
  const storage = getStorage();
  if (!storage) return [];
  try {
    const raw = storage.getItem(usersKey);
    const parsed = raw ? (JSON.parse(raw) as AdminUser[]) : [];
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return defaultUsers;
  } catch {
    return defaultUsers;
  }
};

const saveUsers = (users: AdminUser[]) => {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(usersKey, JSON.stringify(users));
  cachedUsers = users;
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(usersEvent));
  }
};

export const getAdminUsersSnapshot = () => {
  if (cachedUsers) return cachedUsers;
  cachedUsers = readUsers();
  return cachedUsers;
};

export const getAdminUsersServerSnapshot = () => emptyUsersSnapshot;

export const subscribeToAdminUsers = (callback: () => void) => {
  if (typeof window === 'undefined') return () => {};
  const handler = () => {
    cachedUsers = null;
    callback();
  };
  window.addEventListener('storage', handler);
  window.addEventListener(usersEvent, handler);
  return () => {
    window.removeEventListener('storage', handler);
    window.removeEventListener(usersEvent, handler);
  };
};

export const updateAdminUser = (userId: string, updates: UpdateAdminUser) => {
  const users = getAdminUsersSnapshot();
  const nextUsers = users.map((user) =>
    user.id === userId ? { ...user, ...updates } : user
  );
  saveUsers(nextUsers);
};

export const findAdminUser = (userId: string) => {
  const users = getAdminUsersSnapshot();
  return users.find((user) => user.id === userId) || null;
};
