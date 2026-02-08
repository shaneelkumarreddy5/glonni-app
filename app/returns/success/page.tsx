'use client';

import Link from 'next/link';
import { useMemo, useSyncExternalStore } from 'react';
import {
  getLastOrderIdServerSnapshot,
  getLastOrderIdSnapshot,
  subscribeToOrders,
} from '@/lib/orderStorage';

type StoredReturn = {
  orderId: string;
  pickupDate: string;
};

export default function ReturnSuccessPage() {
  const lastOrderId = useSyncExternalStore(
    subscribeToOrders,
    getLastOrderIdSnapshot,
    getLastOrderIdServerSnapshot
  );

  const latestReturn = useMemo<StoredReturn | null>(() => {
    try {
      const raw = localStorage.getItem('returns');
      const parsed = raw ? (JSON.parse(raw) as StoredReturn[]) : [];
      return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : null;
    } catch {
      return null;
    }
  }, []);

  const pickupDate = latestReturn?.pickupDate || '10 Feb 2026';
  const orderId = latestReturn?.orderId || lastOrderId || '';
  const trackHref = orderId ? `/orders/${orderId}` : '/orders';

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-4 py-12 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-12 w-12 text-green-700"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>

        <h1 className="mt-6 text-2xl font-semibold text-gray-900">
          Return Requested Successfully
        </h1>
        <p className="mt-3 text-sm text-gray-600">Pickup scheduled on {pickupDate}</p>
        <p className="mt-1 text-sm text-gray-600">Refund will be processed after pickup</p>

        <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href={trackHref}
            className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800"
          >
            Track Return
          </Link>
          <Link
            href="/orders"
            className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-gray-300"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    </main>
  );
}
