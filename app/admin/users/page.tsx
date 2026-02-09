'use client';

import Link from 'next/link';
import { useMemo, useState, useSyncExternalStore } from 'react';
import {
  getAdminUsersServerSnapshot,
  getAdminUsersSnapshot,
  subscribeToAdminUsers,
} from '@/lib/adminUsers';

const roleStyles: Record<string, string> = {
  user: 'bg-slate-800 text-slate-200 border-slate-700',
  seller: 'bg-amber-500/20 text-amber-200 border-amber-500/40',
  affiliate: 'bg-emerald-500/20 text-emerald-200 border-emerald-500/40',
  admin: 'bg-sky-500/20 text-sky-200 border-sky-500/40',
};

const statusStyles: Record<string, string> = {
  Active: 'bg-emerald-500/15 text-emerald-200 border-emerald-500/40',
  Suspended: 'bg-rose-500/15 text-rose-200 border-rose-500/40',
};

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const users = useSyncExternalStore(
    subscribeToAdminUsers,
    getAdminUsersSnapshot,
    getAdminUsersServerSnapshot
  );

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    return users.filter((user) => {
      const matchesSearch =
        !term ||
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term);
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  return (
    <section className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          Users & Roles
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-100">User Management</h1>
        <p className="mt-1 text-sm text-slate-400">
          Review user access, roles, and account status across the platform.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name or email"
          className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:border-slate-600 focus:outline-none sm:w-72"
        />
        <select
          value={roleFilter}
          onChange={(event) => setRoleFilter(event.target.value)}
          className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:border-slate-600 focus:outline-none"
        >
          <option value="all">All Roles</option>
          <option value="user">User</option>
          <option value="seller">Seller</option>
          <option value="affiliate">Affiliate</option>
          <option value="admin">Admin</option>
        </select>
        <span className="text-xs uppercase tracking-[0.24em] text-slate-500">
          {filteredUsers.length} records
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-950 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            <tr>
              <th className="px-4 py-3">User ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-slate-950/40">
                <td className="px-4 py-3 text-xs text-slate-400">{user.id}</td>
                <td className="px-4 py-3 font-semibold text-slate-100">{user.name}</td>
                <td className="px-4 py-3 text-slate-300">{user.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${
                      roleStyles[user.role]
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
                      statusStyles[user.status]
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-300">{user.joinedAt}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/users/${user.id}`}
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
