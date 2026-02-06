export type OrderStatus = 'Delivered' | 'In Transit' | 'Cancelled';

export interface OrderSummary {
  id: string;
  name: string;
  date: string;
  status: OrderStatus;
  price: string;
  cashback: string;
  address: string;
  image: string;
}

export const mockOrders: OrderSummary[] = [
  {
    id: 'ORD-101',
    name: 'Noise Cancelling Headphones',
    date: '12 Jan 2026',
    status: 'Delivered',
    price: '₹4,299',
    cashback: '₹120',
    address: '204, Lotus Enclave, Banjara Hills, Hyderabad',
    image:
      'https://images.unsplash.com/photo-1518449086331-6f3e6b2c1f0b?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'ORD-102',
    name: 'Smart Fitness Watch',
    date: '18 Jan 2026',
    status: 'In Transit',
    price: '₹2,899',
    cashback: '₹80',
    address: '204, Lotus Enclave, Banjara Hills, Hyderabad',
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'ORD-103',
    name: 'Ergonomic Desk Chair',
    date: '25 Jan 2026',
    status: 'Delivered',
    price: '₹6,499',
    cashback: '₹200',
    address: '204, Lotus Enclave, Banjara Hills, Hyderabad',
    image:
      'https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 'ORD-104',
    name: 'Premium Backpack',
    date: '01 Feb 2026',
    status: 'Cancelled',
    price: '₹2,299',
    cashback: '₹0',
    address: '204, Lotus Enclave, Banjara Hills, Hyderabad',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80',
  },
];
