'use client';

import Link from 'next/link';
import { useMemo, useState, useSyncExternalStore } from 'react';
import {
  getAdminReturnsServerSnapshot,
  getAdminReturnsSnapshot,
  subscribeToAdminReturns,
} from '@/lib/adminReturns';

const statusStyles: Record<string, string> = {
  'Pending Review': 'bg-amber-500/20 text-amber-200 border-amber-500/40',
  Approved: 'bg-emerald-500/20 text-emerald-200 border-emerald-500/40',
  Rejected: 'bg-rose-500/15 text-rose-200 border-rose-500/40',
  'Forced Refund': 'bg-sky-500/20 text-sky-200 border-sky-500/40',
};

export default function AdminReturnsPage() {
  const [statusFilter, setStatusFilter] = useState('all');
  const returnsList = useSyncExternalStore(
    subscribeToAdminReturns,
    getAdminReturnsSnapshot,
    getAdminReturnsServerSnapshot
  );

  const filteredReturns = useMemo(() => {
    return returnsList.filter((entry) => {
      return statusFilter === 'all' || entry.status === statusFilter;
    });
  }, [returnsList, statusFilter]);

  return (
    <section className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          Returns & Disputes
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-100">Return Requests</h1>
        <p className="mt-1 text-sm text-slate-400">
          Review return timelines and resolve disputes quickly.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:border-slate-600 focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="Pending Review">Pending Review</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
          <option value="Forced Refund">Forced Refund</option>
        </select>
        <span className="text-xs uppercase tracking-[0.24em] text-slate-500">
          {filteredReturns.length} returns
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-950 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            <tr>
              <th className="px-4 py-3">Return ID</th>
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Vendor</th>
              <th className="px-4 py-3">Reason</th>
              <th className="px-4 py-3">Refund</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-200">
            {filteredReturns.map((entry) => (
              <tr
                key={entry.id}
                className={
                  entry.status === 'Pending Review'
                    ? 'bg-amber-500/10'
                    : 'hover:bg-slate-950/40'
                }
              >
                <td className="px-4 py-3 text-xs text-slate-400">{entry.id}</td>
                <td className="px-4 py-3 text-slate-300">{entry.orderId}</td>
                <td className="px-4 py-3 font-semibold text-slate-100">{entry.userName}</td>
                <td className="px-4 py-3 text-slate-300">{entry.vendorName}</td>
                <td className="px-4 py-3 text-slate-300">{entry.reason}</td>
                <td className="px-4 py-3 font-semibold text-slate-100">
                  ₹ {entry.refundAmount.toLocaleString('en-IN')}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
                      statusStyles[entry.status]
                    }`}
                  >
                    {entry.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/returns/${entry.id}`}
                    className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300 hover:text-white"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
