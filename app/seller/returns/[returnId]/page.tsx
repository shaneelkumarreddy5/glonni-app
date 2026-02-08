'use client';

import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';
import { useMemo, useState, useSyncExternalStore } from 'react';
import {
  getSellerReturnsServerSnapshot,
  getSellerReturnsSnapshot,
  subscribeToSellerReturns,
  updateSellerReturnStatus,
  type SellerReturnStatus,
} from '@/lib/sellerReturns';
import {
  getSellerOrdersServerSnapshot,
  getSellerOrdersSnapshot,
  subscribeToSellerOrders,
} from '@/lib/sellerOrders';

const timelineMap: Record<SellerReturnStatus, string[]> = {
  Requested: ['Requested'],
  Approved: ['Requested', 'Approved'],
  Picked: ['Requested', 'Approved', 'Picked'],
  Refunded: ['Requested', 'Approved', 'Picked', 'Refunded'],
  Rejected: ['Requested', 'Rejected'],
};

const statusStyles: Record<SellerReturnStatus, string> = {
  Requested: 'bg-amber-100 text-amber-700',
  Approved: 'bg-sky-100 text-sky-700',
  Picked: 'bg-indigo-100 text-indigo-700',
  Refunded: 'bg-green-100 text-green-700',
  Rejected: 'bg-rose-100 text-rose-700',
};

export default function SellerReturnDetailPage({
  params,
}: {
  params: Promise<{ returnId: string }>;
}) {
  const resolvedParams = React.use(params);
  const { returnId } = resolvedParams;
  const returnsData = useSyncExternalStore(
    subscribeToSellerReturns,
    getSellerReturnsSnapshot,
    getSellerReturnsServerSnapshot
  );
  const orders = useSyncExternalStore(
    subscribeToSellerOrders,
    getSellerOrdersSnapshot,
    getSellerOrdersServerSnapshot
  );
  const entry = useMemo(
    () => returnsData.find((item) => item.id === returnId) || null,
    [returnsData, returnId]
  );
  const order = useMemo(
    () => orders.find((item) => item.id === entry?.orderId) || null,
    [orders, entry]
  );

  const [toast, setToast] = useState<string | null>(null);

  if (!entry) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">Return not found</h1>
        <p className="mt-2 text-sm text-slate-500">This return request is missing.</p>
        <Link
          href="/seller/returns"
          className="mt-4 inline-flex rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
        >
          Back to Returns
        </Link>
      </section>
    );
  }

  const timeline = timelineMap[entry.status] || ['Requested'];
  const actionsDisabled = entry.status !== 'Requested';

  const handleApprove = () => {
    updateSellerReturnStatus(entry.id, 'Approved');
    setToast('Return approved. Pickup will be scheduled.');
  };

  const handleReject = () => {
    updateSellerReturnStatus(entry.id, 'Rejected', 'Quality check failed');
    setToast('Return rejected.');
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            href="/seller/returns"
            className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400"
          >
            Back to Returns
          </Link>
          <h1 className="mt-3 text-2xl font-semibold text-slate-900">Return {entry.id}</h1>
          <p className="mt-1 text-sm text-slate-500">Requested on {entry.requestedAt}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[entry.status]}`}>
          {entry.status}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr,0.6fr]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Order Summary</h2>
            <div className="mt-4 grid gap-4 text-sm text-slate-600 md:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-400">Order ID</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{entry.orderId}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-slate-400">Refund Amount</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">₹ {entry.refundAmount}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-slate-400">Reason</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{entry.reason}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-slate-400">Status</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">{entry.status}</p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Customer Details</h2>
            {order ? (
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <p className="font-semibold text-slate-900">{order.customerName}</p>
                <p>{order.customerPhone}</p>
                <p>{order.customerAddress}</p>
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-500">Customer details unavailable.</p>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Product Details</h2>
            <div className="mt-4 flex items-center gap-4">
              <Image
                src={order?.items[0]?.image || '/'}
                alt={entry.productName}
                width={80}
                height={80}
                className="h-20 w-20 rounded-xl object-cover"
              />
              <div>
                <p className="text-sm font-semibold text-slate-900">{entry.productName}</p>
                <p className="mt-1 text-xs text-slate-500">Qty {order?.items[0]?.quantity ?? 1}</p>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Return Timeline</h2>
            <div className="mt-4 space-y-3">
              {timeline.map((step, index) => (
                <div key={step} className="flex items-center gap-3">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                      index < timeline.length ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span className="text-sm text-slate-700">{step}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Vendor Actions</h2>
            <div className="mt-4 space-y-3">
              <button
                type="button"
                onClick={handleApprove}
                disabled={actionsDisabled}
                className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:bg-slate-200"
              >
                Approve Return
              </button>
              <button
                type="button"
                onClick={handleReject}
                disabled={actionsDisabled}
                className="w-full rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 disabled:opacity-60"
              >
                Reject Return
              </button>
              {actionsDisabled && (
                <p className="text-xs text-slate-500">Return has already been processed.</p>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Settlement Impact</h2>
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <div className="flex items-center justify-between">
                <span>Refund Deduction</span>
                <span className="font-semibold text-rose-600">- ₹ {entry.refundAmount}</span>
              </div>
              <p className="text-xs text-slate-500">
                Refunds are deducted from upcoming settlements once approved.
              </p>
            </div>
          </section>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg">
          {toast}
        </div>
      )}
    </section>
  );
}
