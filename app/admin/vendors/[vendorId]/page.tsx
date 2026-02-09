'use client';

import { useMemo, useState, useSyncExternalStore } from 'react';
import { useParams } from 'next/navigation';
import {
  getAdminVendorsServerSnapshot,
  getAdminVendorsSnapshot,
  subscribeToAdminVendors,
  updateAdminVendor,
  type VendorKycStatus,
  type VendorStoreStatus,
} from '@/lib/adminVendors';

const kycOptions: VendorKycStatus[] = ['Not Submitted', 'Under Review', 'Approved'];

export default function AdminVendorDetailPage() {
  const { vendorId } = useParams<{ vendorId: string }>();
  const vendors = useSyncExternalStore(
    subscribeToAdminVendors,
    getAdminVendorsSnapshot,
    getAdminVendorsServerSnapshot
  );

  const vendor = useMemo(
    () => vendors.find((entry) => entry.id === vendorId),
    [vendors, vendorId]
  );

  const [pendingKyc, setPendingKyc] = useState<VendorKycStatus | ''>('');
  const [confirmAction, setConfirmAction] = useState<
    | { type: 'status'; status: VendorStoreStatus }
    | { type: 'kyc'; status: VendorKycStatus }
    | null
  >(null);
  const [toast, setToast] = useState<string | null>(null);

  const effectiveKyc = pendingKyc || vendor?.kycStatus || 'Not Submitted';
  const hasKycChange = !!vendor && pendingKyc !== '' && pendingKyc !== vendor.kycStatus;

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 1400);
  };

  const applyStatusUpdate = (status: VendorStoreStatus) => {
    if (!vendor) return;
    updateAdminVendor(vendor.id, { storeStatus: status });
    setConfirmAction(null);
    showToast(`Vendor ${status.toLowerCase()}`);
  };

  const applyKycUpdate = (status: VendorKycStatus) => {
    if (!vendor) return;
    updateAdminVendor(vendor.id, { kycStatus: status });
    setPendingKyc('');
    setConfirmAction(null);
    showToast('KYC status updated');
  };

  if (!vendor) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-slate-200">
        Vendor not found.
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          Vendor Profile
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-100">{vendor.storeName}</h1>
        <p className="mt-1 text-sm text-slate-400">Owner: {vendor.ownerName}</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            Store Information
          </h2>
          <div className="mt-4 space-y-2 text-sm text-slate-200">
            <p>Store: {vendor.storeName}</p>
            <p>Category: {vendor.category}</p>
            <p>Address: {vendor.address}</p>
            <p>Contact: {vendor.ownerPhone}</p>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            Owner Information
          </h2>
          <div className="mt-4 space-y-2 text-sm text-slate-200">
            <p>Name: {vendor.ownerName}</p>
            <p>Email: {vendor.ownerEmail}</p>
            <p>Phone: {vendor.ownerPhone}</p>
            <p>Joined: {vendor.joinedAt}</p>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            KYC Information
          </h2>
          <p className="mt-4 text-sm text-slate-200">Status: {vendor.kycStatus}</p>
          <div className="mt-3 space-y-2 text-xs text-slate-400">
            {vendor.kycFiles.length === 0 ? (
              <p>No documents submitted.</p>
            ) : (
              vendor.kycFiles.map((file) => <p key={file}>{file}</p>)
            )}
          </div>
          <div className="mt-4">
            <label className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Update KYC
            </label>
            <select
              value={effectiveKyc}
              onChange={(event) => setPendingKyc(event.target.value as VendorKycStatus)}
              className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200"
            >
              {kycOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
          Performance Summary
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Products</p>
            <p className="mt-2 text-lg font-semibold text-slate-100">{vendor.totalProducts}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Orders</p>
            <p className="mt-2 text-lg font-semibold text-slate-100">{vendor.totalOrders}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Total Revenue</p>
            <p className="mt-2 text-lg font-semibold text-slate-100">
              ₹ {vendor.totalRevenue.toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      </section>

      <section className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setConfirmAction({ type: 'status', status: 'Approved' })}
            className="rounded-xl bg-emerald-500/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200"
          >
            Approve Vendor
          </button>
          <button
            type="button"
            onClick={() => setConfirmAction({ type: 'status', status: 'Suspended' })}
            className="rounded-xl border border-rose-500/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-rose-200"
          >
            Suspend Vendor
          </button>
          <button
            type="button"
            onClick={() => setConfirmAction({ type: 'status', status: 'Rejected' })}
            className="rounded-xl border border-amber-500/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200"
          >
            Reject Vendor
          </button>
        </div>
        <button
          type="button"
          onClick={() => setConfirmAction({ type: 'kyc', status: effectiveKyc })}
          disabled={!hasKycChange}
          className={`rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] ${
            hasKycChange
              ? 'bg-slate-100 text-slate-900'
              : 'cursor-not-allowed bg-slate-800 text-slate-500'
          }`}
        >
          Save Changes
        </button>
      </section>

      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950 p-6">
            <h3 className="text-lg font-semibold text-slate-100">Confirm Action</h3>
            <p className="mt-2 text-sm text-slate-300">
              {confirmAction.type === 'status'
                ? `Update store status to ${confirmAction.status}?`
                : `Update KYC status to ${confirmAction.status}?`}
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
                onClick={() => {
                  if (confirmAction.type === 'status') {
                    applyStatusUpdate(confirmAction.status);
                    return;
                  }
                  applyKycUpdate(confirmAction.status);
                }}
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
