'use client';

import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabaseClient';

const quickActions = [
  { title: 'My Orders', hint: 'Track deliveries', icon: 'MO', href: '/user/orders' },
  { title: 'Wallet & Cashback', hint: 'Balance and rewards', icon: 'WC', href: '/user/wallet' },
  { title: 'Wishlist', hint: 'Saved items', icon: 'WL', href: '/user/wishlist' },
  { title: 'Profile', hint: 'Account settings', icon: 'PR', href: '/user/profile' },
];

const recentOrders = [
  {
    id: 'ORD-101',
    name: 'Noise Cancelling Headphones',
    date: '12 Jan 2026',
    status: 'Delivered',
    price: '₹4,299',
    cashback: '₹120',
    address: '204, Lotus Enclave, Banjara Hills, Hyderabad',
    image:
      'https://images.unsplash.com/photo-1518449086331-6f3e6b2c1f0b?auto=format&fit=crop&w=400&q=80',
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
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80',
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
      'https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?auto=format&fit=crop&w=400&q=80',
  },
];

const recommendedProducts = [
  {
    name: '4K Action Camera',
    price: '₹3,499',
    cashback: '5% Cashback',
    image:
      'https://images.unsplash.com/photo-1519183071298-a2962eadcdb2?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Wireless Speaker',
    price: '₹1,799',
    cashback: '8% Cashback',
    image:
      'https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Premium Backpack',
    price: '₹2,299',
    cashback: '6% Cashback',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Smart Home Lamp',
    price: '₹1,299',
    cashback: '4% Cashback',
    image:
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=400&q=80',
  },
];

const wishlistItems = [
  {
    name: 'Bluetooth Earbuds',
    price: '₹1,599',
    image:
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Compact Air Fryer',
    price: '₹2,799',
    image:
      'https://images.unsplash.com/photo-1545632274-8f2a81c66d83?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Leather Laptop Sleeve',
    price: '₹999',
    image:
      'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=400&q=80',
  },
];

export default function UserDashboardPage() {
  const ordersRef = useRef<HTMLDivElement | null>(null);
  const walletRef = useRef<HTMLDivElement | null>(null);
  const wishlistRef = useRef<HTMLDivElement | null>(null);
  const { user, role } = useAuth();
  const [sellerExists, setSellerExists] = useState(false);
  const [affiliateExists, setAffiliateExists] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [approvedRequests, setApprovedRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const [sellerRes, affiliateRes, requestsRes] = await Promise.all([
        supabase.from('sellers').select('id').eq('profile_id', user.id).single(),
        supabase.from('affiliates').select('id').eq('profile_id', user.id).single(),
        supabase.from('role_requests').select('*').eq('profile_id', user.id),
      ]);

      setSellerExists(!!sellerRes.data);
      setAffiliateExists(!!affiliateRes.data);

      const pending = requestsRes.data?.filter((r: any) => r.status === 'pending') || [];
      const approved = requestsRes.data?.filter((r: any) => r.status === 'approved') || [];
      setPendingRequests(pending);
      setApprovedRequests(approved);

      setLoading(false);
    };

    fetchData();
  }, [user]);

  const applyForRole = async (requestedRole: 'seller' | 'affiliate') => {
    setApplying(true);
    const { error } = await supabase.from('role_requests').insert({
      profile_id: user?.id,
      requested_role: requestedRole,
      status: 'pending',
    });

    if (error) {
      alert('Error: ' + error.message);
    } else {
      // Refetch requests
      const { data } = await supabase.from('role_requests').select('*').eq('profile_id', user?.id);
      const pending = data?.filter((r: any) => r.status === 'pending') || [];
      setPendingRequests(pending);
    }
    setApplying(false);
  };

  const handleQuickAction = (target?: string) => {
    if (target === 'orders') {
      ordersRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (target === 'wallet') {
      walletRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (target === 'wishlist') {
      wishlistRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <main className="bg-gray-50">
      <div className="mx-auto w-full max-w-6xl px-6 py-8">
        <section className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">Welcome back, Shaneel</h1>
          <p className="mt-2 text-base text-gray-600">
            Manage your orders, cashback and wishlist
          </p>
        </section>

        {role === 'user' && !loading && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900">Apply for Roles</h2>
            <div className="mt-4 flex gap-4">
              {!sellerExists && !pendingRequests.find((r) => r.requested_role === 'seller') && !approvedRequests.find((r) => r.requested_role === 'seller') && (
                <button
                  onClick={() => applyForRole('seller')}
                  disabled={applying}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  Apply as Seller
                </button>
              )}
              {pendingRequests.find((r) => r.requested_role === 'seller') && <p className="text-gray-600">Application for Seller Pending</p>}
              {approvedRequests.find((r) => r.requested_role === 'seller') && <p className="text-green-600">Seller Application Approved</p>}

              {!affiliateExists && !pendingRequests.find((r) => r.requested_role === 'affiliate') && !approvedRequests.find((r) => r.requested_role === 'affiliate') && (
                <button
                  onClick={() => applyForRole('affiliate')}
                  disabled={applying}
                  className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
                >
                  Apply as Affiliate
                </button>
              )}
              {pendingRequests.find((r) => r.requested_role === 'affiliate') && <p className="text-gray-600">Application for Affiliate Pending</p>}
              {approvedRequests.find((r) => r.requested_role === 'affiliate') && <p className="text-green-600">Affiliate Application Approved</p>}
            </div>
          </section>
        )}

        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => {
            const content = (
              <>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
                  {action.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{action.title}</p>
                  <p className="mt-1 text-xs text-gray-500">{action.hint}</p>
                </div>
              </>
            );

            if (action.href) {
              return (
                <Link
                  key={action.title}
                  href={action.href}
                  className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md"
                >
                  {content}
                </Link>
              );
            }

            return (
              <button
                key={action.title}
                type="button"
                onClick={() => handleQuickAction(action.target)}
                className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md"
              >
                {content}
              </button>
            );
          })}
        </section>

        <section className="mb-8" ref={ordersRef}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <Link href="/user/orders" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              View all
            </Link>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mb-4 flex items-center gap-3">
                  <img
                    src={order.image}
                    alt={order.name}
                    className="h-14 w-14 rounded-lg object-cover"
                    loading="lazy"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{order.name}</p>
                    <p className="mt-1 text-xs text-gray-500">Order {order.id}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{order.date}</span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      order.status === 'Delivered'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <Link
                  href={`/user/orders/${order.id}`}
                  className="mt-4 block w-full rounded-lg border border-gray-200 px-3 py-2 text-center text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:shadow-sm"
                >
                  View Order
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8" ref={walletRef}>
          <div className="rounded-2xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 p-6 text-white">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold">Wallet & Cashback</h2>
                <p className="mt-2 text-sm text-gray-200">
                  Use your cashback on your next purchase.
                </p>
              </div>
              <div className="flex flex-col gap-3 md:items-end">
                <div className="text-sm text-gray-300">Wallet Balance</div>
                <div className="text-2xl font-semibold">₹540</div>
                <div className="text-sm text-gray-300">Cashback Earned: ₹1,240</div>
              </div>
            </div>
            <button
              type="button"
              className="mt-6 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-900"
            >
              Use Cashback
            </button>
          </div>
        </section>

        <section className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recommended Products</h2>
            <button
              type="button"
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              View more
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recommendedProducts.map((product) => (
              <div
                key={product.name}
                className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="mb-4 h-28 w-full rounded-lg object-cover"
                  loading="lazy"
                />
                <p className="text-sm font-semibold text-gray-900">{product.name}</p>
                <p className="mt-1 text-sm text-gray-600">{product.price}</p>
                <span className="mt-3 inline-flex rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                  {product.cashback}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section ref={wishlistRef}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Wishlist Preview</h2>
            <button
              type="button"
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Open wishlist
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {wishlistItems.map((item) => (
              <div
                key={item.name}
                className="min-w-[220px] rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="mb-4 h-24 w-full rounded-lg object-cover"
                  loading="lazy"
                />
                <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                <p className="mt-1 text-sm text-gray-600">{item.price}</p>
                <button
                  type="button"
                  className="mt-4 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:border-gray-300"
                >
                  Move to Cart
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
