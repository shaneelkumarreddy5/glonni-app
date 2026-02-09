'use client';

import { useMemo, useSyncExternalStore } from 'react';
import {
  getAdminWalletsServerSnapshot,
  getAdminWalletsSnapshot,
  subscribeToAdminWallets,
} from '@/lib/adminWallets';

const statusStyles: Record<string, string> = {
  Completed: 'bg-emerald-500/20 text-emerald-200 border-emerald-500/40',
  Pending: 'bg-amber-500/20 text-amber-200 border-amber-500/40',
  Reversed: 'bg-rose-500/15 text-rose-200 border-rose-500/40',
};

export default function AdminWalletsPage() {
  const wallets = useSyncExternalStore(
    subscribeToAdminWallets,
    getAdminWalletsSnapshot,
    getAdminWalletsServerSnapshot
  );

  const totals = useMemo(() => {
    const userBalance = wallets.balances.find((item) => item.type === 'User')?.balance ?? 0;
    const vendorBalance = wallets.balances.find((item) => item.type === 'Vendor')?.balance ?? 0;
    const affiliateBalance =
      wallets.balances.find((item) => item.type === 'Affiliate')?.balance ?? 0;
    const pendingRefunds = wallets.txns
      .filter((txn) => txn.status === 'Pending' && txn.direction === 'Debit')
      .reduce((sum, txn) => sum + txn.amount, 0);

    return {
      userBalance,
      vendorBalance,
      affiliateBalance,
      pendingRefunds,
    };
  }, [wallets]);

  return (
    <section className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          Wallet Oversight
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-100">Wallets Overview</h1>
        <p className="mt-1 text-sm text-slate-400">
          Monitor balances, credits, and pending refunds across wallets.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Total User Wallet Balance
          </p>
          <p className="mt-4 text-2xl font-semibold text-slate-100">
            ₹ {totals.userBalance.toLocaleString('en-IN')}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Total Vendor Payable
          </p>
          <p className="mt-4 text-2xl font-semibold text-slate-100">
            ₹ {totals.vendorBalance.toLocaleString('en-IN')}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Total Affiliate Payable
          </p>
          <p className="mt-4 text-2xl font-semibold text-slate-100">
            ₹ {totals.affiliateBalance.toLocaleString('en-IN')}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Total Pending Refunds
          </p>
          <p className="mt-4 text-2xl font-semibold text-amber-200">
            ₹ {totals.pendingRefunds.toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-950 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            <tr>
              <th className="px-4 py-3">Wallet Type</th>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Credit / Debit</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-200">
            {wallets.txns.map((txn) => (
              <tr key={txn.id} className="hover:bg-slate-950/40">
                <td className="px-4 py-3 font-semibold text-slate-100">{txn.walletType}</td>
                <td className="px-4 py-3 text-slate-300">{txn.reference}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      txn.direction === 'Credit'
                        ? 'text-emerald-200'
                        : 'text-rose-200'
                    }
                  >
                    {txn.direction}
                  </span>
                </td>
                <td className="px-4 py-3 font-semibold text-slate-100">
                  ₹ {txn.amount.toLocaleString('en-IN')}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
                      statusStyles[txn.status]
                    }`}
                  >
                    {txn.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-300">{txn.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </section>
  );
}
