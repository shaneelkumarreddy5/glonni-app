'use client';

import { useMemo } from 'react';

type OrderStatus = 'Pending' | 'Approved' | 'Cancelled';

type ReferredOrder = {
  id: string;
  date: string;
  product: string;
  orderValue: number;
  commissionRate: number;
  status: OrderStatus;
};

const statusStyles: Record<OrderStatus, string> = {
  Pending: 'bg-amber-100 text-amber-700',
  Approved: 'bg-green-100 text-green-700',
  Cancelled: 'bg-rose-100 text-rose-700',
};

const formatCurrency = (value: number) => `₹ ${value.toLocaleString('en-IN')}`;

export default function AffiliateEarningsPage() {
  const { totals, rows } = useMemo(() => {
    const referredOrders: ReferredOrder[] = [
      { id: 'REF-1102', date: '08 Feb 2026', product: 'Aether Linen Shirt', orderValue: 3480, commissionRate: 10, status: 'Approved' },
      { id: 'REF-1101', date: '07 Feb 2026', product: 'Nova Running Shoes', orderValue: 5999, commissionRate: 5, status: 'Pending' },
      { id: 'REF-1100', date: '06 Feb 2026', product: 'Luna Travel Tote', orderValue: 2600, commissionRate: 10, status: 'Approved' },
      { id: 'REF-1099', date: '05 Feb 2026', product: 'Flux Leather Wallet', orderValue: 1250, commissionRate: 8, status: 'Cancelled' },
      { id: 'REF-1098', date: '04 Feb 2026', product: 'Nimbus Desk Lamp', orderValue: 2199, commissionRate: 6, status: 'Approved' },
      { id: 'REF-1097', date: '03 Feb 2026', product: 'Aura Ceramic Mug', orderValue: 1560, commissionRate: 7, status: 'Pending' },
    ];

    const computedRows = referredOrders.map((order) => {
      const commissionAmount = Math.round((order.orderValue * order.commissionRate) / 100);
      return { ...order, commissionAmount };
    });

    const totalEarnings = computedRows.reduce((sum, row) => sum + row.commissionAmount, 0);
    const approvedEarnings = computedRows
      .filter((row) => row.status === 'Approved')
      .reduce((sum, row) => sum + row.commissionAmount, 0);
    const pendingEarnings = computedRows
      .filter((row) => row.status === 'Pending')
      .reduce((sum, row) => sum + row.commissionAmount, 0);

    return {
      totals: {
        total: totalEarnings,
        approved: approvedEarnings,
        pending: pendingEarnings,
        paid: 0,
      },
      rows: computedRows,
    };
  }, []);

  const summaryCards = [
    { label: 'Total Earnings', value: formatCurrency(totals.total), helper: 'Last 30 days' },
    { label: 'Approved Earnings', value: formatCurrency(totals.approved), helper: 'Ready for payout' },
    { label: 'Pending Earnings', value: formatCurrency(totals.pending), helper: 'Awaiting delivery' },
    { label: 'Paid Out', value: formatCurrency(totals.paid), helper: 'This month' },
  ];

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Earnings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Review commissions from referred orders and payout readiness.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              {card.label}
            </p>
            <p className="mt-4 text-2xl font-semibold text-slate-900">{card.value}</p>
            <p className="mt-1 text-xs text-slate-500">{card.helper}</p>
          </div>
        ))}
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Referred Orders</h2>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Commission details
          </span>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Order Value</th>
                <th className="px-4 py-3">Commission %</th>
                <th className="px-4 py-3">Commission</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {rows.map((row) => (
                <tr key={row.id}>
                  <td className="px-4 py-3 font-semibold text-slate-900">{row.id}</td>
                  <td className="px-4 py-3">{row.date}</td>
                  <td className="px-4 py-3">{row.product}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">{formatCurrency(row.orderValue)}</td>
                  <td className="px-4 py-3">{row.commissionRate}%</td>
                  <td className="px-4 py-3 font-semibold text-emerald-600">{formatCurrency(row.commissionAmount)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[row.status]}`}>
                      {row.status}
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
