'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useSyncExternalStore } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  getLastOrderIdServerSnapshot,
  getLastOrderIdSnapshot,
  getOrdersServerSnapshot,
  getOrdersSnapshot,
  subscribeToOrders,
  type StoredOrder,
} from '@/lib/orderStorage';

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orders = useSyncExternalStore(subscribeToOrders, getOrdersSnapshot, getOrdersServerSnapshot);
  const lastOrderId = useSyncExternalStore(
    subscribeToOrders,
    getLastOrderIdSnapshot,
    getLastOrderIdServerSnapshot
  );
  const orderId = searchParams.get('orderId') || lastOrderId;
  const order = useMemo<StoredOrder | null>(
    () => orders.find((item) => item.id === orderId) || null,
    [orders, orderId]
  );

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto w-full max-w-4xl px-4 py-10">
        <section className="rounded-3xl bg-gradient-to-br from-green-50 via-white to-green-100 p-8 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <svg viewBox="0 0 24 24" className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12l4 4L19 7" />
              </svg>
            </div>
            <h1 className="mt-5 text-3xl font-semibold text-gray-900">Order Successful!</h1>
            <p className="mt-2 text-sm text-gray-600">Your order has been placed successfully</p>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-[1.2fr,0.8fr]">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-base font-semibold text-gray-900">Order Summary</h2>
              <div className="mt-4 space-y-3 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Order ID</span>
                  <span className="font-medium text-gray-900">{order?.id || 'GLN-92841'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Expected delivery</span>
                  <span className="font-medium text-gray-900">
                    {order?.expectedDelivery || '14 Feb 2026'}
                  </span>
                </div>
                <div className="rounded-xl bg-green-50 p-3 text-sm font-semibold text-green-700">
                  ₹{order?.cashbackTotal ?? 350} cashback will be credited after delivery
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-base font-semibold text-gray-900">What’s next?</h2>
              <ul className="mt-4 space-y-3 text-sm text-gray-600">
                <li>Track delivery status in your orders.</li>
                <li>Cashback will appear once the order is delivered.</li>
                <li>Need help? Our support team is ready.</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">Items in your order</h2>
            <div className="mt-4 space-y-4">
              {order?.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={72}
                    height={72}
                    className="h-18 w-18 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                    <p className="mt-1 text-sm text-gray-600">₹{item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
              {!order && (
                <p className="text-sm text-gray-500">Your order details will appear here.</p>
              )}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href={order?.id ? `/orders/${order.id}` : '/orders'}
              className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-gray-300"
            >
              Track Order
            </Link>
            <Link
              href="/"
              className="rounded-xl bg-yellow-400 px-5 py-3 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-yellow-300"
            >
              Continue Shopping
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
