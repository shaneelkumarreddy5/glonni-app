'use client';

import { useMemo, useState, useSyncExternalStore } from 'react';
import { useParams } from 'next/navigation';
import {
  getAdminReturnsServerSnapshot,
  getAdminReturnsSnapshot,
  subscribeToAdminReturns,
  updateAdminReturn,
  type AdminReturnStatus,
} from '@/lib/adminReturns';

export default function AdminReturnDetailPage() {
  const { returnId } = useParams<{ returnId: string }>();
  const returnsList = useSyncExternalStore(
    subscribeToAdminReturns,
    getAdminReturnsSnapshot,
    getAdminReturnsServerSnapshot
  );

  const entry = useMemo(
    () => returnsList.find((item) => item.id === returnId),
    [returnsList, returnId]
  );

  const [confirmAction, setConfirmAction] = useState<AdminReturnStatus | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 1400);
  };

  const applyStatus = (status: AdminReturnStatus) => {
    if (!entry) return;
    updateAdminReturn(entry.id, { status });
    setConfirmAction(null);
    showToast(`Return ${status.toLowerCase()}`);
  };

  if (!entry) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-slate-200">
        Return not found.
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          Return Detail
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-100">{entry.id}</h1>
        <p className="mt-1 text-sm text-slate-400">Order {entry.orderId}</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            Return Summary
          </h2>
          <div className="mt-4 space-y-2 text-sm text-slate-200">
            <p>User: {entry.userName}</p>
            <p>Vendor: {entry.vendorName}</p>
            <p>Reason: {entry.reason}</p>
            <p>Status: {entry.status}</p>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            Refund & Wallet
          </h2>
          <div className="mt-4 space-y-2 text-sm text-slate-200">
            <p>Refund Amount: ₹ {entry.refundAmount.toLocaleString('en-IN')}</p>
            <p>Refund Method: {entry.refundMethod}</p>
            <p>Wallet Impact: {entry.walletImpact}</p>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            Vendor Decision
          </h2>
          <p className="mt-4 text-sm text-slate-200">{entry.vendorDecision}</p>
        </section>
      </div>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
          Return Timeline
        </h2>
        <div className="mt-4 space-y-3">
          {entry.timeline.map((step) => (
            <div
              key={step.label}
              className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm"
            >
              <p className="text-slate-200">{step.label}</p>
              <p className="text-xs text-slate-500">{step.date}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setConfirmAction('Approved')}
            className="rounded-xl bg-emerald-500/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200"
          >
            Approve Return
          </button>
          <button
            type="button"
            onClick={() => setConfirmAction('Rejected')}
            className="rounded-xl border border-rose-500/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-rose-200"
          >
            Reject Return
          </button>
          <button
            type="button"
            onClick={() => setConfirmAction('Forced Refund')}
            className="rounded-xl border border-amber-500/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200"
          >
            Force Refund
          </button>
        </div>
      </section>

      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950 p-6">
            <h3 className="text-lg font-semibold text-slate-100">Confirm Action</h3>
            <p className="mt-2 text-sm text-slate-300">
              Set return status to {confirmAction}?
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmAction(null)}
                className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => applyStatus(confirmAction)}
                className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-900"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-900 shadow-lg">
          {toast}
        </div>
      )}
    </section>
  );
}
