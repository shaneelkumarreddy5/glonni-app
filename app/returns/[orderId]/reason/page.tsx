'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { useState } from 'react';

const reasons = [
  'Damaged product',
  'Wrong item delivered',
  'Item not as described',
  'Better price available',
  'No longer needed',
] as const;

export default function ReturnReasonPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const resolvedParams = React.use(params);
  const { orderId } = resolvedParams;
  const router = useRouter();
  const [selectedReason, setSelectedReason] = useState<string>('');

  const handleContinue = () => {
    if (!selectedReason) return;
    try {
      const raw = localStorage.getItem('returnDraft');
      const draft = raw ? (JSON.parse(raw) as Record<string, { reason: string }>) : {};
      draft[orderId] = { reason: selectedReason };
      localStorage.setItem('returnDraft', JSON.stringify(draft));
    } catch {
      localStorage.setItem('returnDraft', JSON.stringify({ [orderId]: { reason: selectedReason } }));
    }

    router.push(`/returns/${orderId}/pickup`);
  };

  return (
    <main className="bg-gray-50">
      <div className="mx-auto w-full max-w-3xl px-4 py-8">
        <h1 className="text-2xl font-semibold text-gray-900">Return Item</h1>

        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <Image
              src="https://images.unsplash.com/photo-1518449086331-6f3e6b2c1f0b?auto=format&fit=crop&w=500&q=80"
              alt="Noise Cancelling Headphones"
              width={96}
              height={96}
              className="h-24 w-24 rounded-xl object-cover"
            />
            <div>
              <p className="text-sm font-semibold text-gray-900">Noise Cancelling Headphones</p>
              <p className="mt-1 text-sm text-gray-600">₹4,299</p>
              <p className="mt-1 text-xs text-gray-500">Order ID: {orderId}</p>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">Why are you returning this item?</h2>
          <div className="mt-4 space-y-3 text-sm">
            {reasons.map((reason) => (
              <label
                key={reason}
                className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3"
              >
                <span className="text-gray-700">{reason}</span>
                <input
                  type="radio"
                  name="return-reason"
                  value={reason}
                  checked={selectedReason === reason}
                  onChange={() => setSelectedReason(reason)}
                  className="h-4 w-4"
                />
              </label>
            ))}
          </div>
        </section>

        <button
          type="button"
          onClick={handleContinue}
          disabled={!selectedReason}
          className="mt-6 w-full rounded-xl bg-yellow-400 px-4 py-3 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Continue
        </button>
      </div>
    </main>
  );
}
