'use client';

import { useMemo, useState, useSyncExternalStore } from 'react';
import {
  getAdminPaymentsServerSnapshot,
  getAdminPaymentsSnapshot,
  subscribeToAdminPayments,
} from '@/lib/adminPayments';

const paymentStyles: Record<string, string> = {
  Pending: 'bg-amber-500/20 text-amber-200 border-amber-500/40',
  Success: 'bg-emerald-500/20 text-emerald-200 border-emerald-500/40',
  Failed: 'bg-rose-500/15 text-rose-200 border-rose-500/40',
  Refunded: 'bg-slate-700 text-slate-300 border-slate-600',
};

export default function AdminPaymentsPage() {
  const [statusFilter, setStatusFilter] = useState('all');
  const payments = useSyncExternalStore(
    subscribeToAdminPayments,
    getAdminPaymentsSnapshot,
    getAdminPaymentsServerSnapshot
  );

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      return statusFilter === 'all' || payment.status === statusFilter;
    });
  }, [payments, statusFilter]);

  return (
    <section className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          Payments Control
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-100">Payments Overview</h1>
        <p className="mt-1 text-sm text-slate-400">
          Track platform payment flow and failure exposure in real time.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:border-slate-600 focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Success">Success</option>
          <option value="Failed">Failed</option>
          <option value="Refunded">Refunded</option>
        </select>
        <span className="text-xs uppercase tracking-[0.24em] text-slate-500">
          {filteredPayments.length} payments
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-950 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            <tr>
              <th className="px-4 py-3">Payment ID</th>
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Vendor</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Method</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-200">
            {filteredPayments.map((payment) => (
              <tr
                key={payment.id}
                className={
                  payment.status === 'Failed'
                    ? 'bg-rose-500/10'
                    : payment.status === 'Refunded'
                      ? 'bg-slate-700/20'
                      : 'hover:bg-slate-950/40'
                }
              >
                <td className="px-4 py-3 text-xs text-slate-400">{payment.id}</td>
                <td className="px-4 py-3 text-slate-300">{payment.orderId}</td>
                <td className="px-4 py-3 font-semibold text-slate-100">{payment.userName}</td>
                <td className="px-4 py-3 text-slate-300">{payment.vendorName}</td>
                <td className="px-4 py-3 font-semibold text-slate-100">
                  ₹ {payment.amount.toLocaleString('en-IN')}
                </td>
                <td className="px-4 py-3 text-slate-300">{payment.method}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
                      paymentStyles[payment.status]
                    }`}
                  >
                    {payment.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-300">{payment.date}</td>
                <td className="px-4 py-3 text-right">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    View
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
