export type SellerProductStatus = 'Active' | 'Inactive';

export type SellerProduct = {
  id: string;
  name: string;
  category: string;
  brand: string;
  description: string;
  mrp: number;
  price: number;
  stock: number;
  sku: string;
  status: SellerProductStatus;
  image: string;
};

type NewSellerProduct = Omit<SellerProduct, 'id' | 'sku'> & { sku?: string };

type UpdateSellerProduct = Partial<Omit<SellerProduct, 'id'>>;

const productsKey = 'glonni_seller_products';
const productsEvent = 'glonni_seller_products_update';

const emptyProductsSnapshot: SellerProduct[] = [];

const defaultProducts: SellerProduct[] = [
  {
    id: 'prd_1001',
    name: 'Aether Linen Shirt',
    category: 'Apparel',
    brand: 'Aether',
    description: 'Breathable linen shirt for summer days.',
    mrp: 2999,
    price: 2499,
    stock: 18,
    sku: 'AE-LIN-042',
    status: 'Active',
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'prd_1002',
    name: 'Nova Running Shoes',
    category: 'Footwear',
    brand: 'Nova',
    description: 'Lightweight trainers with responsive cushioning.',
    mrp: 6999,
    price: 5999,
    stock: 7,
    sku: 'NV-SHO-118',
    status: 'Active',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'prd_1003',
    name: 'Flux Leather Wallet',
    category: 'Accessories',
    brand: 'Flux',
    description: 'Minimal leather wallet with RFID protection.',
    mrp: 1999,
    price: 1250,
    stock: 42,
    sku: 'FL-WAL-009',
    status: 'Active',
    image:
      'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'prd_1004',
    name: 'Nimbus Desk Lamp',
    category: 'Home',
    brand: 'Nimbus',
    description: 'LED desk lamp with adjustable brightness.',
    mrp: 2599,
    price: 2199,
    stock: 4,
    sku: 'NB-LMP-204',
    status: 'Active',
    image:
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'prd_1005',
    name: 'Luna Travel Tote',
    category: 'Bags',
    brand: 'Luna',
    description: 'Structured tote bag with padded laptop sleeve.',
    mrp: 4200,
    price: 3600,
    stock: 0,
    sku: 'LU-TOT-415',
    status: 'Inactive',
    image:
      'https://images.unsplash.com/photo-1522770179533-24471fcdba45?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'prd_1006',
    name: 'Aura Ceramic Mug',
    category: 'Home',
    brand: 'Aura',
    description: 'Set of two ceramic mugs with matte finish.',
    mrp: 899,
    price: 780,
    stock: 12,
    sku: 'AU-MUG-311',
    status: 'Active',
    image:
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=200&q=80',
  },
];

let cachedProducts: SellerProduct[] | null = null;

const getStorage = () => (typeof window === 'undefined' ? null : window.localStorage);

const readProducts = (): SellerProduct[] => {
  const storage = getStorage();
  if (!storage) return [];
  try {
    const raw = storage.getItem(productsKey);
    const parsed = raw ? (JSON.parse(raw) as SellerProduct[]) : [];
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return defaultProducts;
  } catch {
    return defaultProducts;
  }
};

const saveProducts = (products: SellerProduct[]) => {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(productsKey, JSON.stringify(products));
  cachedProducts = products;
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(productsEvent));
  }
};

const createId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `prd_${Date.now()}`;
};

export const generateSku = (name: string) => {
  const base = name
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '-');
  const suffix = Math.floor(100 + Math.random() * 900);
  return `${base.slice(0, 8)}-${suffix}`;
};

export const getProductsSnapshot = () => {
  if (cachedProducts) return cachedProducts;
  cachedProducts = readProducts();
  return cachedProducts;
};

export const getProductsServerSnapshot = () => emptyProductsSnapshot;

export const subscribeToProducts = (callback: () => void) => {
  if (typeof window === 'undefined') return () => {};
  const handler = () => {
    cachedProducts = null;
    callback();
  };
  window.addEventListener('storage', handler);
  window.addEventListener(productsEvent, handler);
  return () => {
    window.removeEventListener('storage', handler);
    window.removeEventListener(productsEvent, handler);
  };
};

export const addSellerProduct = (product: NewSellerProduct) => {
  const products = getProductsSnapshot();
  const nextProduct: SellerProduct = {
    id: createId(),
    ...product,
    sku: product.sku || generateSku(product.name),
    status: product.status ?? 'Active',
  };
  saveProducts([nextProduct, ...products]);
  return nextProduct;
};

export const updateSellerProduct = (productId: string, updates: UpdateSellerProduct) => {
  const products = getProductsSnapshot();
  const next = products.map((product) =>
    product.id === productId ? { ...product, ...updates } : product
  );
  saveProducts(next);
};
