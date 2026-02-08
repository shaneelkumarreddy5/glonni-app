'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useMemo, useSyncExternalStore } from 'react';
import {
  getOrdersServerSnapshot,
  getOrdersSnapshot,
  subscribeToOrders,
  updateStoredOrderReturn,
  type ReturnReason,
} from '@/lib/orderStorage';

type ReturnDraft = {
  reason?: ReturnReason;
  pickupDate?: string;
  refundMethod?: string;
};

type StoredReturn = {
  orderId: string;
  status: 'Requested';
  timeline: string[];
  reason: ReturnReason;
  pickupDate: string;
  refundMethod: string;
  refundAmount: number;
};

export default function ReturnReviewPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const resolvedParams = React.use(params);
  const { orderId } = resolvedParams;
  const router = useRouter();
  const orders = useSyncExternalStore(subscribeToOrders, getOrdersSnapshot, getOrdersServerSnapshot);
  const order = useMemo(() => orders.find((item) => item.id === orderId) || null, [orders, orderId]);

  const draft = useMemo<ReturnDraft>(() => {
    try {
      const raw = localStorage.getItem('returnDraft');
      const parsed = raw ? (JSON.parse(raw) as Record<string, ReturnDraft>) : {};
      return parsed[orderId] || {};
    } catch {
      return {};
    }
  }, [orderId]);

  const refundAmount = order?.total ?? 0;

  const handleConfirm = () => {
    const payload: StoredReturn = {
      orderId,
      status: 'Requested',
      timeline: ['Requested', 'Pickup Scheduled'],
      reason: draft.reason ?? 'Damaged product',
      pickupDate: draft.pickupDate || '10 Feb 2026',
      refundMethod: draft.refundMethod || 'Wallet',
      refundAmount,
    };

    try {
      const raw = localStorage.getItem('returns');
      const parsed = raw ? (JSON.parse(raw) as StoredReturn[]) : [];
      localStorage.setItem('returns', JSON.stringify([payload, ...parsed]));
      window.dispatchEvent(new Event('glonni_returns_update'));
    } catch {
      localStorage.setItem('returns', JSON.stringify([payload]));
      window.dispatchEvent(new Event('glonni_returns_update'));
    }

    updateStoredOrderReturn(orderId, {
      reason: payload.reason,
      resolution: payload.refundMethod === 'Wallet' ? 'Refund to Wallet' : 'Replacement',
      statusStep: 'Return Requested',
      refundStatus: payload.refundMethod === 'Wallet' ? 'Initiated' : undefined,
    });

    router.push('/returns/success');
  };

  return (
    <main className="bg-gray-50">
      <div className="mx-auto w-full max-w-3xl px-4 py-8">
        <h1 className="text-2xl font-semibold text-gray-900">Review Return</h1>

        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">Product</h2>
          <div className="mt-4 flex items-center gap-4">
            <Image
              src={order?.items[0]?.image || '/'}
              alt={order?.items[0]?.title || 'Order item'}
              width={96}
              height={96}
              className="h-24 w-24 rounded-xl object-cover"
            />
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {order?.items[0]?.title || 'Order item'}
              </p>
              <p className="mt-1 text-sm text-gray-600">₹{refundAmount}</p>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">Return Summary</h2>
          <div className="mt-4 space-y-3 text-sm text-gray-700">
            <div className="flex items-center justify-between">
              <span>Reason</span>
              <span className="font-medium text-gray-900">{draft.reason || 'Damaged product'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Pickup Date</span>
              <span className="font-medium text-gray-900">{draft.pickupDate || '10 Feb 2026'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Refund Method</span>
              <span className="font-medium text-gray-900">{draft.refundMethod || 'Wallet'}</span>
            </div>
            <div className="flex items-center justify-between border-t border-dashed border-gray-200 pt-3">
              <span>Refund Amount</span>
              <span className="font-semibold text-green-700">₹{refundAmount}</span>
            </div>
          </div>
        </section>

        <button
          type="button"
          onClick={handleConfirm}
          className="mt-6 w-full rounded-xl bg-yellow-400 px-4 py-3 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-yellow-300"
        >
          Confirm Return
        </button>
      </div>
    </main>
  );
}
