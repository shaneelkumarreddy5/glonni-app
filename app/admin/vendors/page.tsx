'use client';

import Link from 'next/link';
import { useMemo, useState, useSyncExternalStore } from 'react';
import {
  getAdminVendorsServerSnapshot,
  getAdminVendorsSnapshot,
  subscribeToAdminVendors,
} from '@/lib/adminVendors';

const kycStyles: Record<string, string> = {
  'Not Submitted': 'bg-slate-800 text-slate-200 border-slate-700',
  'Under Review': 'bg-amber-500/20 text-amber-200 border-amber-500/40',
  Approved: 'bg-emerald-500/20 text-emerald-200 border-emerald-500/40',
};

const storeStyles: Record<string, string> = {
  Pending: 'bg-amber-500/20 text-amber-200 border-amber-500/40',
  Approved: 'bg-emerald-500/20 text-emerald-200 border-emerald-500/40',
  Suspended: 'bg-rose-500/15 text-rose-200 border-rose-500/40',
  Rejected: 'bg-slate-700 text-slate-300 border-slate-600',
};

export default function AdminVendorsPage() {
  const [storeFilter, setStoreFilter] = useState('all');
  const [kycFilter, setKycFilter] = useState('all');
  const vendors = useSyncExternalStore(
    subscribeToAdminVendors,
    getAdminVendorsSnapshot,
    getAdminVendorsServerSnapshot
  );

  const filteredVendors = useMemo(() => {
    return vendors.filter((vendor) => {
      const matchesStore = storeFilter === 'all' || vendor.storeStatus === storeFilter;
      const matchesKyc = kycFilter === 'all' || vendor.kycStatus === kycFilter;
      return matchesStore && matchesKyc;
    });
  }, [vendors, storeFilter, kycFilter]);

  return (
    <section className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          Vendor Oversight
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-100">Vendor Management</h1>
        <p className="mt-1 text-sm text-slate-400">
          Review seller onboarding, approvals, and operational health.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
        <select
          value={storeFilter}
          onChange={(event) => setStoreFilter(event.target.value)}
          className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:border-slate-600 focus:outline-none"
        >
          <option value="all">All Store Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Suspended">Suspended</option>
          <option value="Rejected">Rejected</option>
        </select>
        <select
          value={kycFilter}
          onChange={(event) => setKycFilter(event.target.value)}
          className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:border-slate-600 focus:outline-none"
        >
          <option value="all">All KYC Status</option>
          <option value="Not Submitted">Not Submitted</option>
          <option value="Under Review">Under Review</option>
          <option value="Approved">Approved</option>
        </select>
        <span className="text-xs uppercase tracking-[0.24em] text-slate-500">
          {filteredVendors.length} vendors
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-950 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            <tr>
              <th className="px-4 py-3">Vendor ID</th>
              <th className="px-4 py-3">Store Name</th>
              <th className="px-4 py-3">Owner Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">KYC Status</th>
              <th className="px-4 py-3">Store Status</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-200">
            {filteredVendors.map((vendor) => {
              const highlight = vendor.storeStatus === 'Pending';
              return (
                <tr
                  key={vendor.id}
                  className={highlight ? 'bg-amber-500/10' : 'hover:bg-slate-950/40'}
                >
                  <td className="px-4 py-3 text-xs text-slate-400">{vendor.id}</td>
                  <td className="px-4 py-3 font-semibold text-slate-100">{vendor.storeName}</td>
                  <td className="px-4 py-3 text-slate-300">{vendor.ownerName}</td>
                  <td className="px-4 py-3 text-slate-300">{vendor.ownerEmail}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
                        kycStyles[vendor.kycStatus]
                      }`}
                    >
                      {vendor.kycStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
                        storeStyles[vendor.storeStatus]
                      }`}
                    >
                      {vendor.storeStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{vendor.joinedAt}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/vendors/${vendor.id}`}
                      className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-300 hover:text-white"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
