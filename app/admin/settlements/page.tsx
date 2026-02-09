'use client';

import { useMemo, useState, useSyncExternalStore } from 'react';
import {
  getAdminSettlementsServerSnapshot,
  getAdminSettlementsSnapshot,
  subscribeToAdminSettlements,
  updateAdminSettlement,
} from '@/lib/adminSettlements';

const statusStyles: Record<string, string> = {
  Pending: 'bg-amber-500/20 text-amber-200 border-amber-500/40',
  Processing: 'bg-sky-500/20 text-sky-200 border-sky-500/40',
  Completed: 'bg-emerald-500/20 text-emerald-200 border-emerald-500/40',
};

export default function AdminSettlementsPage() {
  const [paused, setPaused] = useState(false);
  const [internalNote, setInternalNote] = useState('');

  const settlements = useSyncExternalStore(
    subscribeToAdminSettlements,
    getAdminSettlementsSnapshot,
    getAdminSettlementsServerSnapshot
  );

  const totals = useMemo(() => {
    return settlements.reduce(
      (sum, settlement) => sum + settlement.amount,
      0
    );
  }, [settlements]);

  const markPaid = (id: string) => {
    updateAdminSettlement(id, { status: 'Completed' });
  };

  return (
    <section className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          Settlements Control
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-100">Settlements</h1>
        <p className="mt-1 text-sm text-slate-400">
          Settlements are processed after delivery & return window.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Total Scheduled
          </p>
          <p className="mt-4 text-2xl font-semibold text-slate-100">
            ₹ {totals.toLocaleString('en-IN')}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Settlement Control
          </p>
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPaused((prev) => !prev)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] ${
                paused
                  ? 'border border-emerald-500/50 text-emerald-200'
                  : 'border border-rose-500/50 text-rose-200'
              }`}
            >
              {paused ? 'Resume Settlements' : 'Pause Settlements'}
            </button>
            <span className="text-xs text-slate-400">
              {paused ? 'Paused' : 'Active'}
            </span>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Internal Note
          </p>
          <textarea
            value={internalNote}
            onChange={(event) => setInternalNote(event.target.value)}
            rows={3}
            placeholder="Add a finance note..."
            className="mt-3 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-950 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            <tr>
              <th className="px-4 py-3">Settlement ID</th>
              <th className="px-4 py-3">Vendor / Affiliate</th>
              <th className="px-4 py-3">Period</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-200">
            {settlements.map((settlement) => (
              <tr key={settlement.id} className="hover:bg-slate-950/40">
                <td className="px-4 py-3 text-xs text-slate-400">{settlement.id}</td>
                <td className="px-4 py-3 font-semibold text-slate-100">
                  {settlement.counterparty}
                </td>
                <td className="px-4 py-3 text-slate-300">{settlement.period}</td>
                <td className="px-4 py-3 font-semibold text-slate-100">
                  ₹ {settlement.amount.toLocaleString('en-IN')}
                </td>
                <td className="px-4 py-3 text-slate-300">{settlement.type}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
                      statusStyles[settlement.status]
                    }`}
                  >
                    {settlement.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => markPaid(settlement.id)}
                    disabled={settlement.status === 'Completed'}
                    className={`rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] ${
                      settlement.status === 'Completed'
                        ? 'cursor-not-allowed bg-slate-800 text-slate-500'
                        : 'bg-slate-100 text-slate-900'
                    }`}
                  >
                    Mark Paid
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
