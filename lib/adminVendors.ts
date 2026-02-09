export type VendorKycStatus = 'Not Submitted' | 'Under Review' | 'Approved';
export type VendorStoreStatus = 'Pending' | 'Approved' | 'Suspended' | 'Rejected';

export type AdminVendor = {
  id: string;
  storeName: string;
  category: string;
  address: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  kycStatus: VendorKycStatus;
  storeStatus: VendorStoreStatus;
  joinedAt: string;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  kycFiles: string[];
};

type UpdateAdminVendor = Partial<Omit<AdminVendor, 'id'>>;

const vendorsKey = 'glonni_admin_vendors';
const vendorsEvent = 'glonni_admin_vendors_update';

const emptyVendorsSnapshot: AdminVendor[] = [];

const defaultVendors: AdminVendor[] = [
  {
    id: 'vnd_2001',
    storeName: 'Aether Studio',
    category: 'Apparel',
    address: '24B, Indiranagar, Bengaluru',
    ownerName: 'Kabir Nair',
    ownerEmail: 'kabir.nair@glonni.app',
    ownerPhone: '+91 90000 11002',
    kycStatus: 'Approved',
    storeStatus: 'Approved',
    joinedAt: '08 Jun 2025',
    totalProducts: 48,
    totalOrders: 1280,
    totalRevenue: 1245000,
    kycFiles: ['PAN_Kabir.pdf', 'GST_AetherStudio.pdf', 'Bank_Statement.pdf'],
  },
  {
    id: 'vnd_2002',
    storeName: 'Nimbus Home',
    category: 'Home & Living',
    address: '55/2, Banjara Hills, Hyderabad',
    ownerName: 'Isha Banerjee',
    ownerEmail: 'isha.banerjee@glonni.app',
    ownerPhone: '+91 90000 11005',
    kycStatus: 'Under Review',
    storeStatus: 'Pending',
    joinedAt: '27 Aug 2024',
    totalProducts: 22,
    totalOrders: 410,
    totalRevenue: 312000,
    kycFiles: ['PAN_Isha.pdf', 'GST_NimbusHome.pdf'],
  },
  {
    id: 'vnd_2003',
    storeName: 'Luna Bags Co.',
    category: 'Bags',
    address: '11A, Sector 18, Noida',
    ownerName: 'Rhea Kapoor',
    ownerEmail: 'rhea.kapoor@glonni.app',
    ownerPhone: '+91 90000 11003',
    kycStatus: 'Not Submitted',
    storeStatus: 'Pending',
    joinedAt: '19 Nov 2025',
    totalProducts: 12,
    totalOrders: 98,
    totalRevenue: 89000,
    kycFiles: [],
  },
  {
    id: 'vnd_2004',
    storeName: 'Flux Accessories',
    category: 'Accessories',
    address: '77, Park Street, Kolkata',
    ownerName: 'Devansh Rao',
    ownerEmail: 'devansh.rao@glonni.app',
    ownerPhone: '+91 90000 11004',
    kycStatus: 'Approved',
    storeStatus: 'Suspended',
    joinedAt: '02 Feb 2025',
    totalProducts: 35,
    totalOrders: 540,
    totalRevenue: 420000,
    kycFiles: ['PAN_Devansh.pdf', 'GST_FluxAccessories.pdf', 'Bank_Statement.pdf'],
  },
  {
    id: 'vnd_2005',
    storeName: 'Nova Sports',
    category: 'Footwear',
    address: '5th Ave, MG Road, Pune',
    ownerName: 'Arjun Varma',
    ownerEmail: 'arjun.varma@glonni.app',
    ownerPhone: '+91 90000 11006',
    kycStatus: 'Approved',
    storeStatus: 'Approved',
    joinedAt: '05 Oct 2023',
    totalProducts: 58,
    totalOrders: 2120,
    totalRevenue: 2584000,
    kycFiles: ['PAN_Arjun.pdf', 'GST_NovaSports.pdf', 'Cancelled_Cheque.pdf'],
  },
];

let cachedVendors: AdminVendor[] | null = null;

const getStorage = () => (typeof window === 'undefined' ? null : window.localStorage);

const readVendors = (): AdminVendor[] => {
  const storage = getStorage();
  if (!storage) return [];
  try {
    const raw = storage.getItem(vendorsKey);
    const parsed = raw ? (JSON.parse(raw) as AdminVendor[]) : [];
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return defaultVendors;
  } catch {
    return defaultVendors;
  }
};

const saveVendors = (vendors: AdminVendor[]) => {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(vendorsKey, JSON.stringify(vendors));
  cachedVendors = vendors;
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(vendorsEvent));
  }
};

export const getAdminVendorsSnapshot = () => {
  if (cachedVendors) return cachedVendors;
  cachedVendors = readVendors();
  return cachedVendors;
};

export const getAdminVendorsServerSnapshot = () => emptyVendorsSnapshot;

export const subscribeToAdminVendors = (callback: () => void) => {
  if (typeof window === 'undefined') return () => {};
  const handler = () => {
    cachedVendors = null;
    callback();
  };
  window.addEventListener('storage', handler);
  window.addEventListener(vendorsEvent, handler);
  return () => {
    window.removeEventListener('storage', handler);
    window.removeEventListener(vendorsEvent, handler);
  };
};

export const updateAdminVendor = (vendorId: string, updates: UpdateAdminVendor) => {
  const vendors = getAdminVendorsSnapshot();
  const nextVendors = vendors.map((vendor) =>
    vendor.id === vendorId ? { ...vendor, ...updates } : vendor
  );
  saveVendors(nextVendors);
};

export const findAdminVendor = (vendorId: string) => {
  const vendors = getAdminVendorsSnapshot();
  return vendors.find((vendor) => vendor.id === vendorId) || null;
};

export const findVendorByOwner = (ownerEmail?: string | null) => {
  if (!ownerEmail) return null;
  const vendors = getAdminVendorsSnapshot();
  return vendors.find((vendor) => vendor.ownerEmail === ownerEmail) || null;
};
