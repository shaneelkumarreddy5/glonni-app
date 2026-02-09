'use client';

import Link from 'next/link';
import { useMemo, useState, useSyncExternalStore } from 'react';
import {
  getAdminOrdersServerSnapshot,
  getAdminOrdersSnapshot,
  subscribeToAdminOrders,
} from '@/lib/adminOrders';

const paymentStyles: Record<string, string> = {
  Paid: 'bg-emerald-500/20 text-emerald-200 border-emerald-500/40',
  Failed: 'bg-rose-500/15 text-rose-200 border-rose-500/40',
  Pending: 'bg-amber-500/20 text-amber-200 border-amber-500/40',
  Refunded: 'bg-slate-700 text-slate-300 border-slate-600',
};

const orderStyles: Record<string, string> = {
  Placed: 'bg-slate-800 text-slate-200 border-slate-700',
  Processing: 'bg-amber-500/20 text-amber-200 border-amber-500/40',
  Shipped: 'bg-sky-500/20 text-sky-200 border-sky-500/40',
  Delivered: 'bg-emerald-500/20 text-emerald-200 border-emerald-500/40',
  Cancelled: 'bg-rose-500/15 text-rose-200 border-rose-500/40',
};

const returnStyles: Record<string, string> = {
  None: 'bg-slate-800 text-slate-200 border-slate-700',
  Pending: 'bg-amber-500/20 text-amber-200 border-amber-500/40',
  Approved: 'bg-emerald-500/20 text-emerald-200 border-emerald-500/40',
  Rejected: 'bg-rose-500/15 text-rose-200 border-rose-500/40',
};

export default function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [vendorFilter, setVendorFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');

  const orders = useSyncExternalStore(
    subscribeToAdminOrders,
    getAdminOrdersSnapshot,
    getAdminOrdersServerSnapshot
  );

  const vendorOptions = useMemo(() => {
    const names = Array.from(new Set(orders.map((order) => order.vendorName)));
    return names.sort();
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus = statusFilter === 'all' || order.orderStatus === statusFilter;
      const matchesVendor = vendorFilter === 'all' || order.vendorName === vendorFilter;
      const matchesPayment = paymentFilter === 'all' || order.paymentStatus === paymentFilter;
      return matchesStatus && matchesVendor && matchesPayment;
    });
  }, [orders, statusFilter, vendorFilter, paymentFilter]);

  return (
    <section className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          Global Orders
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-100">Orders Overview</h1>
        <p className="mt-1 text-sm text-slate-400">
          Track payments, fulfillment, and return exposure in one view.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:border-slate-600 focus:outline-none"
        >
          <option value="all">All Order Status</option>
          <option value="Placed">Placed</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <select
          value={vendorFilter}
          onChange={(event) => setVendorFilter(event.target.value)}
          className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:border-slate-600 focus:outline-none"
        >
          <option value="all">All Vendors</option>
          {vendorOptions.map((vendor) => (
            <option key={vendor} value={vendor}>
              {vendor}
            </option>
          ))}
        </select>
        <select
          value={paymentFilter}
          onChange={(event) => setPaymentFilter(event.target.value)}
          className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:border-slate-600 focus:outline-none"
        >
          <option value="all">All Payments</option>
          <option value="Paid">Paid</option>
          <option value="Failed">Failed</option>
          <option value="Pending">Pending</option>
          <option value="Refunded">Refunded</option>
        </select>
        <span className="text-xs uppercase tracking-[0.24em] text-slate-500">
          {filteredOrders.length} orders
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-950 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            <tr>
              <th className="px-4 py-3">Order ID</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Vendor</th>
              <th className="px-4 py-3">Value</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Order Status</th>
              <th className="px-4 py-3">Return</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-200">
            {filteredOrders.map((order) => {
              const isFailed = order.paymentStatus === 'Failed';
              const isReturned = order.returnStatus !== 'None';
              const isHighValue = order.value >= 10000;
              const rowClass = isFailed
                ? 'bg-rose-500/10'
                : isReturned
                  ? 'bg-amber-500/10'
                  : isHighValue
                    ? 'bg-sky-500/10'
                    : 'hover:bg-slate-950/40';

              return (
                <tr key={order.id} className={rowClass}>
                  <td className="px-4 py-3 text-xs text-slate-400">{order.id}</td>
                  <td className="px-4 py-3 text-slate-300">{order.date}</td>
                  <td className="px-4 py-3 font-semibold text-slate-100">{order.userName}</td>
                  <td className="px-4 py-3 text-slate-300">{order.vendorName}</td>
                  <td className="px-4 py-3 font-semibold text-slate-100">
                    ₹ {order.value.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
                        paymentStyles[order.paymentStatus]
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
                        orderStyles[order.orderStatus]
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
                        returnStyles[order.returnStatus]
                      }`}
                    >
                      {order.returnStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/orders/${order.id}`}
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
