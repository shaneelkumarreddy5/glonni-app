'use client';

import { useMemo, useState, useSyncExternalStore } from 'react';
import { useParams } from 'next/navigation';
import {
  getAdminUsersServerSnapshot,
  getAdminUsersSnapshot,
  subscribeToAdminUsers,
  updateAdminUser,
  type AdminUserRole,
} from '@/lib/adminUsers';

const roleOptions: AdminUserRole[] = ['user', 'seller', 'affiliate', 'admin'];

export default function AdminUserDetailPage() {
  const { userId } = useParams<{ userId: string }>();
  const users = useSyncExternalStore(
    subscribeToAdminUsers,
    getAdminUsersSnapshot,
    getAdminUsersServerSnapshot
  );

  const user = useMemo(
    () => users.find((entry) => entry.id === userId),
    [users, userId]
  );

  const [selectedRole, setSelectedRole] = useState<AdminUserRole | ''>('');
  const [pendingStatus, setPendingStatus] = useState<'Active' | 'Suspended' | ''>('');
  const [confirmAction, setConfirmAction] = useState<'role' | 'status' | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const effectiveRole = selectedRole || user?.role || 'user';
  const effectiveStatus = pendingStatus || user?.status || 'Active';

  const hasRoleChange = !!user && selectedRole !== '' && selectedRole !== user.role;

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 1400);
  };

  const confirmRoleChange = () => {
    if (!user || !selectedRole) return;
    updateAdminUser(user.id, { role: selectedRole });
    setSelectedRole('');
    setConfirmAction(null);
    showToast('Role updated');
  };

  const confirmStatusChange = () => {
    if (!user || !pendingStatus) return;
    updateAdminUser(user.id, { status: pendingStatus });
    setPendingStatus('');
    setConfirmAction(null);
    showToast(pendingStatus === 'Suspended' ? 'User suspended' : 'User activated');
  };

  if (!user) {
    return (
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-slate-200">
        User not found.
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          User Profile
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-100">{user.name}</h1>
        <p className="mt-1 text-sm text-slate-400">{user.email}</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            Basic Info
          </h2>
          <div className="mt-4 space-y-2 text-sm text-slate-200">
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Phone: {user.phone}</p>
            <p>Joined: {user.joinedAt}</p>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            Role Information
          </h2>
          <p className="mt-4 text-sm text-slate-200">
            Current role: <span className="font-semibold capitalize">{user.role}</span>
          </p>
          <div className="mt-4">
            <label className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Change Role
            </label>
            <select
              value={effectiveRole}
              onChange={(event) => setSelectedRole(event.target.value as AdminUserRole)}
              className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200"
            >
              {roleOptions.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            Account Status
          </h2>
          <p className="mt-4 text-sm text-slate-200">
            Status: <span className="font-semibold">{user.status}</span>
          </p>
          <button
            type="button"
            onClick={() => {
              setPendingStatus(user.status === 'Active' ? 'Suspended' : 'Active');
              setConfirmAction('status');
            }}
            className={`mt-4 w-full rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] ${
              user.status === 'Active'
                ? 'border border-rose-500/50 text-rose-200 hover:border-rose-400'
                : 'border border-emerald-500/50 text-emerald-200 hover:border-emerald-400'
            }`}
          >
            {user.status === 'Active' ? 'Suspend User' : 'Activate User'}
          </button>
        </section>
      </div>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
          Activity Summary
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Orders</p>
            <p className="mt-2 text-lg font-semibold text-slate-100">{user.ordersCount}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Returns</p>
            <p className="mt-2 text-lg font-semibold text-slate-100">{user.returnsCount}</p>
          </div>
        </div>
      </section>

      <section className="flex flex-wrap items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => setConfirmAction('role')}
          disabled={!hasRoleChange}
          className={`rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] ${
            hasRoleChange
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
              {confirmAction === 'role'
                ? `Change role to ${effectiveRole}?`
                : `Set status to ${effectiveStatus}?`}
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setConfirmAction(null);
                  setPendingStatus('');
                }}
                className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmAction === 'role' ? confirmRoleChange : confirmStatusChange}
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
