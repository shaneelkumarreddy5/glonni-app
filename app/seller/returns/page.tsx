'use client';

import Link from 'next/link';
import { useMemo, useState, useSyncExternalStore } from 'react';
import {
  getSellerReturnsServerSnapshot,
  getSellerReturnsSnapshot,
  subscribeToSellerReturns,
  updateSellerReturnStatus,
  type SellerReturn,
  type SellerReturnStatus,
} from '@/lib/sellerReturns';

const tabs: Array<'All' | SellerReturnStatus> = [
  'All',
  'Requested',
  'Approved',
  'Picked',
  'Refunded',
  'Rejected',
];

const statusStyles: Record<SellerReturnStatus, string> = {
  Requested: 'bg-amber-100 text-amber-700',
  Approved: 'bg-sky-100 text-sky-700',
  Picked: 'bg-indigo-100 text-indigo-700',
  Refunded: 'bg-green-100 text-green-700',
  Rejected: 'bg-rose-100 text-rose-700',
};

export default function SellerReturnsPage() {
  const returnsData = useSyncExternalStore(
    subscribeToSellerReturns,
    getSellerReturnsSnapshot,
    getSellerReturnsServerSnapshot
  );
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>('All');
  const [toast, setToast] = useState<string | null>(null);

  const filteredReturns = useMemo(() => {
    return returnsData.filter((entry) => activeTab === 'All' || entry.status === activeTab);
  }, [returnsData, activeTab]);

  const handleApprove = (entry: SellerReturn) => {
    updateSellerReturnStatus(entry.id, 'Approved');
    setToast('Return approved. Pickup will be scheduled.');
  };

  const handleReject = (entry: SellerReturn) => {
    updateSellerReturnStatus(entry.id, 'Rejected', 'Quality check failed');
    setToast('Return rejected. Customer notified.');
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Returns</h1>
          <p className="mt-1 text-sm text-slate-500">Review and action customer return requests.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] ${
                isActive
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-white text-slate-600'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            <tr>
              <th className="px-4 py-3">Return ID</th>
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Reason</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Refund</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filteredReturns.map((entry) => {
              const isNew = entry.status === 'Requested';
              return (
                <tr key={entry.id} className={isNew ? 'bg-amber-50/60' : 'hover:bg-slate-50'}>
                  <td className="px-4 py-3 font-semibold text-slate-900">{entry.id}</td>
                  <td className="px-4 py-3">{entry.orderId}</td>
                  <td className="px-4 py-3">{entry.productName}</td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <p>{entry.reason}</p>
                      {entry.status === 'Rejected' && entry.rejectionReason && (
                        <p className="text-xs text-rose-600">Rejected: {entry.rejectionReason}</p>
                      )}
                      {entry.status === 'Approved' && (
                        <p className="text-xs text-slate-500">Pickup will be scheduled</p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        statusStyles[entry.status]
                      }`}
                    >
                      {entry.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-900">₹ {entry.refundAmount}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/seller/returns/${entry.id}`}
                        className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600"
                      >
                        View
                      </Link>
                      {entry.status === 'Requested' && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleApprove(entry)}
                            className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-700"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReject(entry)}
                            className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-600"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg">
          {toast}
        </div>
      )}
    </section>
  );
}
