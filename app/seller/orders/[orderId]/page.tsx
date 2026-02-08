'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useMemo, useState, useSyncExternalStore } from 'react';
import {
  getSellerOrdersServerSnapshot,
  getSellerOrdersSnapshot,
  subscribeToSellerOrders,
  updateSellerOrderStatus,
  type SellerOrderStatus,
} from '@/lib/sellerOrders';

const statusFlow: Record<SellerOrderStatus, SellerOrderStatus | null> = {
  New: 'Packed',
  Packed: 'Shipped',
  Shipped: 'Delivered',
  Delivered: null,
  Returned: null,
};

const statusStyles: Record<SellerOrderStatus, string> = {
  New: 'bg-amber-100 text-amber-700',
  Packed: 'bg-indigo-100 text-indigo-700',
  Shipped: 'bg-sky-100 text-sky-700',
  Delivered: 'bg-green-100 text-green-700',
  Returned: 'bg-rose-100 text-rose-700',
};

export default function SellerOrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const resolvedParams = React.use(params);
  const { orderId } = resolvedParams;
  const router = useRouter();
  const orders = useSyncExternalStore(
    subscribeToSellerOrders,
    getSellerOrdersSnapshot,
    getSellerOrdersServerSnapshot
  );
  const order = useMemo(
    () => orders.find((item) => item.id === orderId) || null,
    [orders, orderId]
  );

  const [nextStatus, setNextStatus] = useState<SellerOrderStatus>('Packed');
  const [showToast, setShowToast] = useState(false);

  React.useEffect(() => {
    if (!order) return;
    const candidate = statusFlow[order.status];
    if (candidate) {
      setNextStatus(candidate);
    }
  }, [order]);

  if (!order) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">Order not found</h1>
        <p className="mt-2 text-sm text-slate-500">
          This order is missing or was removed.
        </p>
        <Link
          href="/seller/orders"
          className="mt-4 inline-flex rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
        >
          Back to Orders
        </Link>
      </section>
    );
  }

  const primaryItem = order.items[0];
  const disableUpdates = order.hasReturn || !statusFlow[order.status];

  const handleStatusUpdate = () => {
    updateSellerOrderStatus(order.id, nextStatus);
    setShowToast(true);
    setTimeout(() => {
      router.push('/seller/orders');
    }, 700);
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/seller/orders" className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Back to Orders
          </Link>
          <h1 className="mt-3 text-2xl font-semibold text-slate-900">Order {order.id}</h1>
          <p className="mt-1 text-sm text-slate-500">Placed on {order.date}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[order.status]}`}>
            {order.status}
          </span>
          {order.hasReturn && (
            <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
              Return Requested
            </span>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr,0.6fr]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Order Summary</h2>
            <div className="mt-4 grid gap-4 text-sm text-slate-600 md:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-400">Order ID</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{order.id}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-slate-400">Total Amount</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">₹ {order.amount}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-slate-400">Status</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{order.status}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-slate-400">Payment</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{order.paymentStatus}</p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Customer Details</h2>
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <p className="font-semibold text-slate-900">{order.customerName}</p>
              <p>{order.customerPhone}</p>
              <p>{order.customerAddress}</p>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Product Details</h2>
            <div className="mt-4 flex flex-col gap-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="h-20 w-20 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                    <p className="mt-1 text-xs text-slate-500">Qty {item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">₹ {item.price}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Payment Details</h2>
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <div className="flex items-center justify-between">
                <span>Method</span>
                <span className="font-semibold text-slate-900">{order.paymentStatus}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Paid Status</span>
                <span className="font-semibold text-slate-900">
                  {order.paymentStatus === 'Paid' ? 'Paid' : 'Pending'}
                </span>
              </div>
              <p className="text-xs text-slate-500">Cashback is tracked after delivery.</p>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Vendor Actions</h2>
            <div className="mt-4 space-y-3">
              <label className="text-sm font-semibold text-slate-700">
                Update Status
                <select
                  value={nextStatus}
                  onChange={(event) => setNextStatus(event.target.value as SellerOrderStatus)}
                  disabled={disableUpdates}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm disabled:bg-slate-50"
                >
                  {statusFlow[order.status] ? (
                    <option value={statusFlow[order.status] || ''}>
                      {statusFlow[order.status]}
                    </option>
                  ) : (
                    <option value={order.status}>{order.status}</option>
                  )}
                </select>
              </label>
              {order.hasReturn && (
                <p className="text-xs text-rose-600">
                  Return requested. Status updates are disabled.
                </p>
              )}
              {!order.hasReturn && statusFlow[order.status] && (
                <button
                  type="button"
                  onClick={handleStatusUpdate}
                  className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
                >
                  Confirm Update
                </button>
              )}
              {order.hasReturn && (
                <Link
                  href="/seller/returns"
                  className="block w-full rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-center text-sm font-semibold text-rose-700"
                >
                  Go to Returns
                </Link>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Order Snapshot</h2>
            <div className="mt-4 flex items-center gap-3">
              <Image
                src={primaryItem?.image ?? '/'}
                alt={primaryItem?.name || 'Order item'}
                width={64}
                height={64}
                className="h-16 w-16 rounded-xl object-cover"
              />
              <div>
                <p className="text-sm font-semibold text-slate-900">{primaryItem?.name}</p>
                <p className="text-xs text-slate-500">Qty {primaryItem?.quantity}</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      {showToast && (
        <div className="fixed bottom-6 right-6 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg">
          Order status updated
        </div>
      )}
    </section>
  );
}
