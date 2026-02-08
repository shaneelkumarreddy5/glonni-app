'use client';

import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useMemo, useState, useSyncExternalStore } from 'react';
import {
  getOrdersServerSnapshot,
  getOrdersSnapshot,
  subscribeToOrders,
} from '@/lib/orderStorage';

const pickupDates = ['10 Feb 2026', '11 Feb 2026', '12 Feb 2026'];

export default function ReturnPickupPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const resolvedParams = React.use(params);
  const { orderId } = resolvedParams;
  const router = useRouter();
  const orders = useSyncExternalStore(subscribeToOrders, getOrdersSnapshot, getOrdersServerSnapshot);
  const order = useMemo(
    () => orders.find((item) => item.id === orderId) || null,
    [orders, orderId]
  );
  const [selectedDate, setSelectedDate] = useState(pickupDates[0]);
  const [refundMethod, setRefundMethod] = useState<'Wallet' | 'Original'>('Wallet');

  const pickupAddress = order?.address || 'Flat 302, Green Residency, Madhapur, Hyderabad, Telangana – 500081';

  const handleContinue = () => {
    try {
      const raw = localStorage.getItem('returnDraft');
      const draft = raw ? (JSON.parse(raw) as Record<string, { reason?: string; pickupDate?: string; refundMethod?: string }>) : {};
      draft[orderId] = {
        ...draft[orderId],
        pickupDate: selectedDate,
        refundMethod,
      };
      localStorage.setItem('returnDraft', JSON.stringify(draft));
    } catch {
      localStorage.setItem(
        'returnDraft',
        JSON.stringify({ [orderId]: { pickupDate: selectedDate, refundMethod } })
      );
    }

    router.push(`/returns/${orderId}/review`);
  };

  return (
    <main className="bg-gray-50">
      <div className="mx-auto w-full max-w-3xl px-4 py-8">
        <h1 className="text-2xl font-semibold text-gray-900">Pickup & Refund</h1>

        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">Pickup Address</h2>
          <p className="mt-3 text-sm text-gray-600">{pickupAddress}</p>
        </section>

        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">Select Pickup Date</h2>
          <div className="mt-4 grid gap-3 text-sm">
            {pickupDates.map((date) => (
              <label
                key={date}
                className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3"
              >
                <span className="text-gray-700">{date}</span>
                <input
                  type="radio"
                  name="pickupDate"
                  value={date}
                  checked={selectedDate === date}
                  onChange={() => setSelectedDate(date)}
                  className="h-4 w-4"
                />
              </label>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">Refund Method</h2>
          <div className="mt-4 grid gap-3 text-sm">
            <label className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3">
              <div>
                <p className="font-medium text-gray-900">Wallet (fastest)</p>
                <p className="mt-1 text-xs text-gray-500">Instant credit after approval.</p>
              </div>
              <input
                type="radio"
                name="refundMethod"
                value="Wallet"
                checked={refundMethod === 'Wallet'}
                onChange={() => setRefundMethod('Wallet')}
                className="h-4 w-4"
              />
            </label>
            <label className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3">
              <div>
                <p className="font-medium text-gray-900">Original payment method</p>
                <p className="mt-1 text-xs text-gray-500">2-5 business days after approval.</p>
              </div>
              <input
                type="radio"
                name="refundMethod"
                value="Original"
                checked={refundMethod === 'Original'}
                onChange={() => setRefundMethod('Original')}
                className="h-4 w-4"
              />
            </label>
          </div>
          <p className="mt-4 text-sm text-gray-500">Refund after item pickup & quality check.</p>
        </section>

        <button
          type="button"
          onClick={handleContinue}
          className="mt-6 w-full rounded-xl bg-yellow-400 px-4 py-3 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-yellow-300"
        >
          Continue
        </button>
      </div>
    </main>
  );
}
