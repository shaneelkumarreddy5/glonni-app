'use client';

import { useMemo, useSyncExternalStore } from 'react';
import {
  getSellerOrdersServerSnapshot,
  getSellerOrdersSnapshot,
  subscribeToSellerOrders,
} from '@/lib/sellerOrders';
import {
  getSellerReturnsServerSnapshot,
  getSellerReturnsSnapshot,
  subscribeToSellerReturns,
} from '@/lib/sellerReturns';

type SettlementStatus = 'Pending' | 'Settled';

type SettlementEntry = {
  id: string;
  date: string;
  reference: string;
  type: 'Order Credit' | 'Refund Debit';
  amount: number;
  status: SettlementStatus;
};

const statusStyles: Record<SettlementStatus, string> = {
  Pending: 'bg-amber-100 text-amber-700',
  Settled: 'bg-green-100 text-green-700',
};

const formatCurrency = (value: number) => `₹ ${value.toLocaleString('en-IN')}`;

export default function SellerWalletPage() {
  const orders = useSyncExternalStore(
    subscribeToSellerOrders,
    getSellerOrdersSnapshot,
    getSellerOrdersServerSnapshot
  );
  const returnsData = useSyncExternalStore(
    subscribeToSellerReturns,
    getSellerReturnsSnapshot,
    getSellerReturnsServerSnapshot
  );

  const { summary, entries } = useMemo(() => {
    const totalEarnings = orders.reduce((sum, order) => sum + order.amount, 0);
    const completedSettlements = orders
      .filter((order) => order.status === 'Delivered')
      .reduce((sum, order) => sum + order.amount, 0);
    const pendingSettlement = orders
      .filter((order) => order.status !== 'Delivered')
      .reduce((sum, order) => sum + order.amount, 0);
    const refundDeductions = returnsData
      .filter((entry) => entry.status === 'Refunded')
      .reduce((sum, entry) => sum + entry.refundAmount, 0);

    const settlementEntries: SettlementEntry[] = [
      ...orders.map((order) => {
        const status: SettlementStatus = order.status === 'Delivered' ? 'Settled' : 'Pending';
        return {
          id: `order-${order.id}`,
          date: order.date,
          reference: order.id,
          type: 'Order Credit' as const,
          amount: order.amount,
          status,
        };
      }),
      ...returnsData
        .filter((entry) => entry.status === 'Refunded')
        .map((entry) => ({
          id: `return-${entry.id}`,
          date: entry.requestedAt,
          reference: entry.id,
          type: 'Refund Debit' as const,
          amount: entry.refundAmount,
          status: 'Settled' as const,
        })),
    ].sort((a, b) => (a.date < b.date ? 1 : -1));

    return {
      summary: {
        totalEarnings,
        pendingSettlement,
        completedSettlements,
        refundDeductions,
      },
      entries: settlementEntries,
    };
  }, [orders, returnsData]);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Wallet & Settlements</h1>
        <p className="mt-1 text-sm text-slate-500">Monitor payouts and refund deductions.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {
          [
            { label: 'Total Earnings', value: formatCurrency(summary.totalEarnings) },
            { label: 'Pending Settlement', value: formatCurrency(summary.pendingSettlement) },
            { label: 'Completed Settlements', value: formatCurrency(summary.completedSettlements) },
            { label: 'Refund Deductions', value: formatCurrency(summary.refundDeductions) },
          ].map((card) => (
            <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                {card.label}
              </p>
              <p className="mt-4 text-2xl font-semibold text-slate-900">{card.value}</p>
            </div>
          ))
        }
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Settlement Activity</h2>
        <p className="mt-1 text-sm text-slate-500">
          Settlement processed after delivery. Refunds are deducted from upcoming settlements.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Reference</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {entries.map((entry) => (
                <tr key={entry.id}>
                  <td className="px-4 py-3">{entry.date}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">{entry.reference}</td>
                  <td className="px-4 py-3">{entry.type}</td>
                  <td className={`px-4 py-3 font-semibold ${
                    entry.type === 'Refund Debit' ? 'text-rose-600' : 'text-emerald-600'
                  }`}>
                    {entry.type === 'Refund Debit' ? '-' : '+'} {formatCurrency(entry.amount)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[entry.status]}`}>
                      {entry.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
