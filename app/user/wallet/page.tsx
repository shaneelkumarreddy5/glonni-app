"use client";

import Link from 'next/link';
import { useMemo, useSyncExternalStore } from 'react';
import {
  getOrdersServerSnapshot,
  getOrdersSnapshot,
  subscribeToOrders,
  type StoredOrder,
} from '@/lib/orderStorage';

const statusStyles: Record<string, string> = {
  Credited: 'bg-green-100 text-green-800',
  Pending: 'bg-amber-100 text-amber-800',
  Initiated: 'bg-sky-100 text-sky-700',
  Processing: 'bg-amber-100 text-amber-700',
  Completed: 'bg-green-100 text-green-800',
};

type StoredReturn = {
  orderId: string;
  status?: string;
  timeline?: string[];
  refundAmount?: number;
};

const getReturnsSnapshot = (): StoredReturn[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem('returns');
    const parsed = raw ? (JSON.parse(raw) as StoredReturn[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const getReturnsServerSnapshot = () => [] as StoredReturn[];

const subscribeToReturns = (callback: () => void) => {
  if (typeof window === 'undefined') return () => {};
  const handler = () => callback();
  window.addEventListener('storage', handler);
  return () => window.removeEventListener('storage', handler);
};

export default function UserWalletPage() {
  const orders = useSyncExternalStore(subscribeToOrders, getOrdersSnapshot, getOrdersServerSnapshot);
  const returns = useSyncExternalStore(
    subscribeToReturns,
    getReturnsSnapshot,
    getReturnsServerSnapshot
  );

  const { pendingCashback, creditedCashback, refundCredits, pendingRefunds, creditedRefunds, history } = useMemo(() => {
    const pending = orders
      .filter((order) => order.status !== 'Delivered')
      .reduce((sum, order) => sum + order.cashbackTotal, 0);
    const credited = orders
      .filter((order) => order.status === 'Delivered')
      .reduce((sum, order) => sum + order.cashbackTotal, 0);

    const isRefunded = (entry: StoredReturn) => {
      if (entry.status === 'Refunded') return true;
      const timeline = entry.timeline ?? [];
      return timeline.includes('Refunded') || timeline.includes('Refund Initiated');
    };

    const pendingRefundEntries = returns.filter((entry) => !isRefunded(entry));
    const creditedRefundEntries = returns.filter((entry) => isRefunded(entry));
    const refunds = creditedRefundEntries.reduce((sum, entry) => sum + (entry.refundAmount ?? 0), 0);

    const orderEntries = orders.map((order) => ({
      date: order.createdAt,
      reference: order.id,
      amount: `+${order.cashbackTotal}`,
      status: order.status === 'Delivered' ? 'Credited' : 'Pending',
    }));

    const refundEntries = returns.map((entry) => {
      const order = orders.find((item) => item.id === entry.orderId) || null;
      return {
        date: order?.createdAt || '08 Feb 2026',
        reference: `Refund for Order ${entry.orderId}`,
        amount: `+${entry.refundAmount ?? order?.total ?? 0}`,
        status: isRefunded(entry) ? 'Credited' : 'Pending',
      };
    });

    const promoEntries = [
      { date: '20 Jan 2026', reference: 'Promo Bonus', amount: '+200', status: 'Credited' },
    ];

    return {
      pendingCashback: pending,
      creditedCashback: credited,
      refundCredits: refunds,
      pendingRefunds: pendingRefundEntries,
      creditedRefunds: creditedRefundEntries,
      history: [...orderEntries, ...refundEntries, ...promoEntries],
    };
  }, [orders, returns]);

  return (
    <main className="bg-gray-50">
      <div className="mx-auto w-full max-w-5xl px-6 py-8">
        <div className="mb-6">
          <Link href="/user" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Back to Account
          </Link>
          <h1 className="mt-3 text-2xl font-semibold text-gray-900">Wallet & Cashback</h1>
          <p className="mt-1 text-sm text-gray-500">Track your balance and cashback activity.</p>
        </div>

        <section className="mb-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 p-6 text-white shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-slate-200">Wallet Balance</p>
              <p className="mt-2 text-3xl font-semibold">₹540</p>
            </div>
            <div className="grid gap-3 text-sm text-slate-200">
              <div className="flex items-center justify-between gap-6">
                <span>Total Cashback Earned</span>
                <span className="font-semibold text-white">₹{creditedCashback}</span>
              </div>
              <div className="flex items-center justify-between gap-6">
                <span>Pending Cashback</span>
                <span className="font-semibold text-white">₹{pendingCashback}</span>
              </div>
              <div className="flex items-center justify-between gap-6">
                <span>Refund Credits</span>
                <span className="font-semibold text-white">₹{refundCredits}</span>
              </div>
            </div>
          </div>
          <button
            type="button"
            disabled
            className="mt-6 w-full rounded-lg bg-white/20 px-4 py-2 text-sm font-semibold text-white/70"
          >
            Use Cashback
          </button>
        </section>

        <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Cashback History</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Reference</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-gray-700">
                {history.map((txn) => (
                  <tr key={`${txn.reference}-${txn.date}`}>
                    <td className="px-4 py-3">{txn.date}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{txn.reference}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">{txn.amount}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          statusStyles[txn.status] || 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {txn.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Refunds</h2>
          <div className="mt-4 grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm font-semibold text-gray-900">Pending Refunds</p>
              <div className="mt-3 space-y-3 text-sm text-gray-700">
                {pendingRefunds.length === 0 && (
                  <p className="text-sm text-gray-500">No pending refunds.</p>
                )}
                {pendingRefunds.map((entry) => (
                  <div key={`pending-${entry.orderId}`} className="flex items-center justify-between">
                    <span>Refund for Order {entry.orderId}</span>
                    <span className="font-semibold">
                      ₹{entry.refundAmount ?? 0}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-green-200 bg-green-50 p-4">
              <p className="text-sm font-semibold text-gray-900">Credited Refunds</p>
              <div className="mt-3 space-y-3 text-sm text-gray-700">
                {creditedRefunds.length === 0 && (
                  <p className="text-sm text-gray-500">No credited refunds yet.</p>
                )}
                {creditedRefunds.map((entry) => (
                  <div key={`credited-${entry.orderId}`} className="flex items-center justify-between">
                    <span>Refund for Order {entry.orderId}</span>
                    <span className="font-semibold text-green-700">
                      ₹{entry.refundAmount ?? 0}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
          <h2 className="text-base font-semibold">Cashback Rules</h2>
          <ul className="mt-2 space-y-1 text-amber-800">
            <li>Cashback is credited after order delivery.</li>
            <li>Cashback can be used for future purchases.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
