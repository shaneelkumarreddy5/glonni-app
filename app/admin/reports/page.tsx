'use client';

import { useMemo, useState } from 'react';

const summaryCards = [
  { label: 'Total Revenue', value: '₹ 3.2 Cr' },
  { label: 'Total Orders', value: '48,900' },
  { label: 'Average Order Value', value: '₹ 1,840' },
  { label: 'Total Refunds', value: '₹ 42.5 L' },
];

const orderSeries = [120, 180, 210, 260, 300, 280, 360, 390, 420, 460];
const maxOrderValue = Math.max(...orderSeries, 1);

const revenueSplit = [
  { label: 'Vendors', value: 62, color: 'bg-emerald-400' },
  { label: 'Affiliates', value: 18, color: 'bg-sky-400' },
  { label: 'Platform', value: 20, color: 'bg-amber-300' },
];

export default function AdminReportsPage() {
  const [dateRange, setDateRange] = useState('last-30');

  const returnsRate = useMemo(() => 4.3, []);

  return (
    <section className="space-y-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          Reports
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-100">Sales Insights</h1>
        <p className="mt-1 text-sm text-slate-400">
          Snapshot of revenue, order flow, and return exposure.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
        <select
          value={dateRange}
          onChange={(event) => setDateRange(event.target.value)}
          className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:border-slate-600 focus:outline-none"
        >
          <option value="last-7">Last 7 days</option>
          <option value="last-30">Last 30 days</option>
          <option value="last-90">Last 90 days</option>
        </select>
        <button
          type="button"
          className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200"
        >
          Export CSV
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              {card.label}
            </p>
            <p className="mt-4 text-2xl font-semibold text-slate-100">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            Orders Over Time
          </h2>
          <div className="mt-4 flex h-48 items-end gap-2">
            {orderSeries.map((value, index) => (
              <div key={`bar-${index}`} className="flex-1">
                <div
                  className="rounded-t-lg bg-sky-400"
                  style={{ height: `${Math.round((value / maxOrderValue) * 100)}%` }}
                />
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-500">Mock data · {dateRange}</p>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            Revenue Split
          </h2>
          <div className="mt-4 space-y-3">
            {revenueSplit.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className={`h-3 w-3 rounded-full ${item.color}`} />
                  <p className="text-sm text-slate-200">{item.label}</p>
                </div>
                <p className="text-sm font-semibold text-slate-100">{item.value}%</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            Returns Rate
          </h2>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            {returnsRate}%
          </span>
        </div>
        <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-slate-800">
          <div className="h-full rounded-full bg-amber-300" style={{ width: `${returnsRate}%` }} />
        </div>
        <p className="mt-3 text-xs text-slate-500">Target: under 5%</p>
      </section>
    </section>
  );
}
